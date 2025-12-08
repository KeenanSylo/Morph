import React, { useEffect, useRef } from "react";
import { useMorphStore } from "../../store/useMorphStore";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number; alpha: number }[];
}

export default function SwarmCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  const {
    swarmCount,
    swarmSpeed,
    swarmCohesion,
    swarmSeparation,
    swarmTrailLength,
    swarmSize,
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

    // Initialize particles
    particlesRef.current = Array.from({ length: swarmCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      trail: [],
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = darkMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isPaused) {
        const particles = particlesRef.current;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        particles.forEach((p, i) => {
          // Cohesion - move toward center or mouse
          const targetX = mouseRef.current.active ? mouseRef.current.x : centerX;
          const targetY = mouseRef.current.active ? mouseRef.current.y : centerY;
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cohesionForce = swarmCohesion / 1000;

          p.vx += (dx / dist) * cohesionForce;
          p.vy += (dy / dist) * cohesionForce;

          // Separation - avoid other particles
          particles.forEach((other, j) => {
            if (i === j) return;
            const dx = other.x - p.x;
            const dy = other.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = swarmSeparation;

            if (dist < minDist && dist > 0) {
              const force = (minDist - dist) / minDist;
              p.vx -= (dx / dist) * force * 0.5;
              p.vy -= (dy / dist) * force * 0.5;
            }
          });

          // Limit velocity
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const maxSpeed = swarmSpeed;
          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }

          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Wrap around edges
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;

          // Update trail
          p.trail.push({ x: p.x, y: p.y, alpha: 1 });
          if (p.trail.length > swarmTrailLength) {
            p.trail.shift();
          }
          p.trail.forEach((t) => {
            t.alpha *= 0.95;
          });
        });
      }

      // Draw particles
      const particles = particlesRef.current;
      particles.forEach((p, i) => {
        // Draw trail
        p.trail.forEach((t, ti) => {
          const progress = ti / p.trail.length;
          const color = interpolateColor(gradientColors[0], gradientColors[1], progress);
          ctx.fillStyle = color;
          ctx.globalAlpha = t.alpha * 0.6;
          ctx.beginPath();
          ctx.arc(t.x, t.y, swarmSize * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw particle
        const progress = i / particles.length;
        const color = interpolateColor(gradientColors[0], gradientColors[1], progress);
        ctx.fillStyle = color;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, swarmSize, 0, Math.PI * 2);
        ctx.fill();

        // Add glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, swarmSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    swarmCount,
    swarmSpeed,
    swarmCohesion,
    swarmSeparation,
    swarmTrailLength,
    swarmSize,
    gradientColors,
    isPaused,
    darkMode,
  ]);

  return (
    <canvas
      ref={canvasRef}
      id="swarm-canvas"
      className="absolute inset-0 z-0"
    />
  );
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
