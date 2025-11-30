import React, { useEffect, useRef } from "react";
import { useMorphStore } from "../../store/useMorphStore";

interface BlobCanvasProps {
  interactive?: boolean;
}

export default function BlobCanvas({ interactive = true }: BlobCanvasProps) {
  const store = useMorphStore();
  
  // Destructure state with defaults for non-interactive mode
  const chaos = interactive ? store.chaos : 30;
  const smoothness = interactive ? store.smoothness : 10;
  const warp = interactive ? store.warp : 50;
  const motionSpeed = interactive ? store.motionSpeed : 3;
  const isPaused = interactive ? store.isPaused : false;
  
  const fillType = interactive ? store.fillType : 'linear';
  // CHANGED: Default colors updated to Rose-600 -> Orange-400 (Warm Sunset) instead of AI Blue/Purple
  const colors = interactive ? store.gradientColors : ['#e11d48', '#fb923c'];
  const glow = interactive ? store.glowIntensity : 40;

  const pathRef = useRef<SVGPathElement>(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  // Keyboard Listener for Pause
  useEffect(() => {
    if (!interactive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle pause on Spacebar, but not if user is typing in an input
      if (e.code === 'Space') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          store.setIsPaused(!store.isPaused);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interactive, store.isPaused]);

  // Animation Loop
  useEffect(() => {
    const render = () => {
      // Only increment time if not paused
      if (!isPaused) {
        // Slower, more organic time progression
        const speedFactor = 0.002 + (motionSpeed * 0.0002); 
        timeRef.current += speedFactor;
      }
      
      const path = generateBlobPath(timeRef.current, chaos, smoothness, warp);
      
      if (pathRef.current) {
        pathRef.current.setAttribute("d", path);
      }
      
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [chaos, smoothness, warp, motionSpeed, isPaused]);

  // Construct Gradient ID
  const gradId = "morph-gradient";
  const glowId = "morph-glow";

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      <svg 
        id="morph-svg-target"
        xmlns="http://www.w3.org/2000/svg"
        width="100%" 
        height="100%" 
        // Increased viewBox to give the blob more room (zoom out effect)
        viewBox="-200 -200 400 400" 
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
            {/* Dynamic Glow Filter */}
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={glow / 5} result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>

            {/* Dynamic Gradients */}
            {fillType === 'linear' && (
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors[0]} />
                    <stop offset="100%" stopColor={colors[1]} />
                </linearGradient>
            )}
            {fillType === 'radial' && (
                <radialGradient id={gradId} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                    <stop offset="0%" stopColor={colors[0]} />
                    <stop offset="100%" stopColor={colors[1]} />
                </radialGradient>
            )}
        </defs>

        {/* The Blob */}
        <path
            ref={pathRef}
            fill={fillType === 'solid' ? colors[0] : `url(#${gradId})`}
            filter={`url(#${glowId})`}
            className="transition-[fill] duration-500 ease-in-out"
        />
      </svg>
    </div>
  );
}

/**
 * Generates a smooth organic blob path using clamped math.
 */
function generateBlobPath(time: number, chaos: number, smoothness: number, warp: number) {
    // Constraint: Smoothness determines points count (3 to 20 range)
    // 3 = Triangle, 4 = Square, 8+ = Circle/Blob
    const pointsCount = Math.max(3, Math.min(20, smoothness));
    
    // Base radius of the blob (Defined in SVG units)
    const baseRadius = 60;
    
    // Constraint: Max distortion is 40% of radius to prevent self-intersection
    // Chaos (0-100) maps to 0.0 - 0.4
    const maxDistortion = baseRadius * 0.4 * (chaos / 100);
    
    // Warp (0-100) controls noise frequency. 
    // Low warp = large slow pulses. High warp = quick ripples.
    const noiseFreq = 0.5 + (warp / 100) * 4.0;

    const points: [number, number][] = [];
    
    for (let i = 0; i < pointsCount; i++) {
        const angle = (i / pointsCount) * Math.PI * 2;
        
        // Stacked Sine Waves for organic noise
        // Using `angle` phase shifts ensures the noise wraps around correctly
        const n1 = Math.sin(angle * noiseFreq + time);
        const n2 = Math.cos(angle * (noiseFreq * 1.5) - time * 0.5);
        
        // Normalize roughly to -1 to 1 range
        const noise = (n1 + n2) / 2;
        
        // Apply distortion to radius
        const r = baseRadius + (noise * maxDistortion);

        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        points.push([x, y]);
    }

    // Use Catmull-Rom Spline for C1 continuity (Smooth curves)
    return spline(points, 1, true);
}

/**
 * Catmull-Rom Spline interpolation.
 * Converts a set of points into a smooth cubic bezier path string.
 */
function spline(points: [number, number][], tension: number = 1, close: boolean = false): string {
  const size = points.length;
  if (size === 0) return "";
  
  let path = "";
  const getPoint = (idx: number) => points[(idx + size) % size];

  for (let i = 0; i < size; i++) {
    const p0 = getPoint(i - 1);
    const p1 = getPoint(i);
    const p2 = getPoint(i + 1);
    const p3 = getPoint(i + 2);

    if (i === 0) {
      path += `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
    }

    // Catmull-Rom to Cubic Bezier control points calculation
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6 * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6 * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6 * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6 * tension;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    
    if (!close && i === size - 2) break;
  }

  if (close) path += " Z";
  return path;
}