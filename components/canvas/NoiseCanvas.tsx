import React, { useEffect, useRef } from "react";
import { useMorphStore } from "../../store/useMorphStore";

// Simple noise implementation
class SimplexNoise {
  private perm: number[];

  constructor(seed: number = Math.random()) {
    this.perm = this.buildPermutation(seed);
  }

  private buildPermutation(seed: number): number[] {
    const p = new Array(256);
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    // Fisher-Yates shuffle with seed
    for (let i = 255; i > 0; i--) {
      const r = Math.floor((seed * 9301 + 49297) % 233280 / 233280 * (i + 1));
      seed = (seed * 9301 + 49297) % 233280;
      [p[i], p[r]] = [p[r], p[i]];
    }
    return p.concat(p);
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const a = this.perm[X] + Y;
    const b = this.perm[X + 1] + Y;
    return this.lerp(
      v,
      this.lerp(u, this.grad(this.perm[a], x, y), this.grad(this.perm[b], x - 1, y)),
      this.lerp(u, this.grad(this.perm[a + 1], x, y - 1), this.grad(this.perm[b + 1], x - 1, y - 1))
    );
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
}

export default function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const noiseRef = useRef(new SimplexNoise(42));
  const timeRef = useRef(0);

  const {
    noiseOctaves,
    noiseFrequency,
    noisePersistence,
    noiseLacunarity,
    noiseAnimation,
    noiseContrast,
    gradientColors,
    isPaused,
    darkMode,
  } = useMorphStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const noise = noiseRef.current;

    const octaveNoise = (x: number, y: number, z: number): number => {
      let value = 0;
      let amplitude = 1;
      let frequency = noiseFrequency / 100;
      let maxValue = 0;

      for (let i = 0; i < noiseOctaves; i++) {
        value += noise.noise2D(x * frequency + z, y * frequency + z) * amplitude;
        maxValue += amplitude;
        amplitude *= noisePersistence;
        frequency *= noiseLacunarity;
      }

      return value / maxValue;
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      if (!isPaused) {
        timeRef.current += noiseAnimation * 0.01;
      }

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      const resolution = 2; // Process every nth pixel for performance
      const contrast = (noiseContrast / 50) * 2;

      for (let y = 0; y < canvas.height; y += resolution) {
        for (let x = 0; x < canvas.width; x += resolution) {
          const nx = x / canvas.width;
          const ny = y / canvas.height;

          let noiseValue = octaveNoise(nx * 3, ny * 3, timeRef.current);
          
          // Apply contrast
          noiseValue = (noiseValue - 0.5) * contrast + 0.5;
          noiseValue = Math.max(0, Math.min(1, noiseValue));

          // Interpolate colors
          const color = interpolateColor(gradientColors[0], gradientColors[1], noiseValue);
          const rgb = hexToRgb(color);

          // Fill resolution x resolution block
          for (let dy = 0; dy < resolution && y + dy < canvas.height; dy++) {
            for (let dx = 0; dx < resolution && x + dx < canvas.width; dx++) {
              const i = ((y + dy) * canvas.width + (x + dx)) * 4;
              data[i] = rgb.r;
              data[i + 1] = rgb.g;
              data[i + 2] = rgb.b;
              data[i + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    noiseOctaves,
    noiseFrequency,
    noisePersistence,
    noiseLacunarity,
    noiseAnimation,
    noiseContrast,
    gradientColors,
    isPaused,
    darkMode,
  ]);

  return <canvas ref={canvasRef} id="noise-canvas" className="absolute inset-0 z-0" />;
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}
