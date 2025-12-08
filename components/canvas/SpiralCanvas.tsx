import React, { useEffect, useRef } from "react";
import { useMorphStore } from "../../store/useMorphStore";

interface Star {
  angle: number;
  distance: number;
  armIndex: number;
  size: number;
  speed: number;
}

export default function SpiralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const rotationRef = useRef(0);

  const {
    spiralArms,
    spiralTightness,
    spiralParticles,
    spiralRotation,
    spiralThickness,
    spiralGlow,
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

    // Initialize stars
    const totalStars = spiralParticles * spiralArms;
    starsRef.current = Array.from({ length: totalStars }, (_, i) => {
      const armIndex = Math.floor(i / spiralParticles);
      const progress = (i % spiralParticles) / spiralParticles;
      const distance = progress * (Math.min(canvas.width, canvas.height) * 0.4);
      const tightnessFactor = spiralTightness / 50;
      const angle = progress * Math.PI * 4 * tightnessFactor + (armIndex * (Math.PI * 2)) / spiralArms;

      return {
        angle,
        distance,
        armIndex,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.5,
      };
    });

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = darkMode ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isPaused) {
        rotationRef.current += spiralRotation * 0.001;
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const stars = starsRef.current;

      // Draw center glow
      const glowIntensity = spiralGlow / 100;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
      gradient.addColorStop(0, `${gradientColors[0]}${Math.round(glowIntensity * 255).toString(16).padStart(2, "0")}`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        const totalRotation = rotationRef.current + star.angle;
        const thicknessVariation = (Math.random() - 0.5) * spiralThickness;
        const x = centerX + Math.cos(totalRotation) * (star.distance + thicknessVariation);
        const y = centerY + Math.sin(totalRotation) * (star.distance + thicknessVariation);

        // Color based on distance from center
        const progress = star.distance / (Math.min(canvas.width, canvas.height) * 0.4);
        const color = interpolateColor(gradientColors[0], gradientColors[1], progress);

        // Draw star with glow
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = 1 - progress * 0.5;

        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    spiralArms,
    spiralTightness,
    spiralParticles,
    spiralRotation,
    spiralThickness,
    spiralGlow,
    gradientColors,
    isPaused,
    darkMode,
  ]);

  return <canvas ref={canvasRef} id="spiral-canvas" className="absolute inset-0 z-0" />;
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
