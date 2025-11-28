import React, { useEffect, useRef } from "react";
import { useMorphStore } from "../../store/useMorphStore";

export default function BlobCanvas() {
  const { complexity, contrast, motionSpeed, fillColor } = useMorphStore();
  const pathRef = useRef<SVGPathElement>(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const render = () => {
      // Increment time based on motionSpeed
      // 0-100 range -> mapped to sensible speed
      const speedFactor = 0.001 + (motionSpeed * 0.0005); 
      timeRef.current += speedFactor;
      
      const path = generateBlobPath(timeRef.current, complexity, contrast);
      
      if (pathRef.current) {
        pathRef.current.setAttribute("d", path);
      }
      
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [complexity, contrast, motionSpeed]);

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-slate-900 via-slate-950 to-slate-950 opacity-80 pointer-events-none" />
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="-120 -120 240 240" 
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none w-full h-full"
      >
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <path
            ref={pathRef}
            fill={fillColor}
            fillOpacity={1}
            filter="url(#glow)"
            className="transition-[fill] duration-500 ease-out"
        />
      </svg>
    </div>
  );
}

// Generate a smooth closed path using Sine Stacking and Catmull-Rom Splines
function generateBlobPath(time: number, complexity: number, contrast: number) {
    const pointsCount = 128; 
    const baseRadius = 60; 
    const points: [number, number][] = [];
    
    // Map params
    // Frequency: How many bumps. 
    // Low complexity = 2-3 bumps. High = many small bumps.
    const baseFreq = 2 + (complexity / 100) * 8; 
    
    // Amplitude: How deep the bumps are.
    const maxAmp = 5 + (contrast / 100) * 35;

    for (let i = 0; i < pointsCount; i++) {
        const angle = (i / pointsCount) * Math.PI * 2;
        
        // Sine Stack Noise (Dependency-free organic randomness)
        // 1. Primary wave (Shape)
        const n1 = Math.sin(angle * baseFreq + time);
        // 2. Secondary wave (Detail)
        const n2 = Math.sin(angle * (baseFreq * 2) - time * 1.5);
        // 3. Tertiary wave (Texture)
        const n3 = Math.sin(angle * (baseFreq * 3) + time * 0.5);

        // Combine them
        const noise = (n1 * 0.6) + (n2 * 0.3) + (n3 * 0.1);

        const r = baseRadius + (noise * maxAmp);

        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        points.push([x, y]);
    }

    // Convert points to smooth Spline
    return spline(points, 1, true);
}

/**
 * Catmull-Rom Spline interpolation
 * Converts a set of points into a smooth Cubic Bezier path
 * @param points Array of [x, y] coordinates
 * @param tension Curve softness (1 is standard soft, 0 is sharp)
 * @param close Whether to close the loop
 */
function spline(points: [number, number][], tension: number = 1, close: boolean = false): string {
  const size = points.length;
  if (size === 0) return "";
  
  let path = "";

  // Helper to get point at index with wrap-around handling
  const getPoint = (idx: number) => points[(idx + size) % size];

  for (let i = 0; i < size; i++) {
    // Determine control points for Catmull-Rom
    // We look at p0(prev), p1(curr), p2(next), p3(next-next)
    
    const p0 = getPoint(i - 1);
    const p1 = getPoint(i);
    const p2 = getPoint(i + 1);
    const p3 = getPoint(i + 2);

    if (i === 0) {
      path += `M ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
    }

    // Calculate Cubic Bezier control points based on Catmull-Rom tangents
    // Tangent at P1 is parallel to P2-P0
    // Tangent at P2 is parallel to P3-P1
    // The divisor 6 is standard for Catmull-Rom -> Bezier conversion
    
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6 * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6 * tension;

    const cp2x = p2[0] - (p3[0] - p1[0]) / 6 * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6 * tension;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    
    // Stop early if not closed loop (not used in this specific blob case but good practice)
    if (!close && i === size - 2) break;
  }

  if (close) path += " Z";
  return path;
}