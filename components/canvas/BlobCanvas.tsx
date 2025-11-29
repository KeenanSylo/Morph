import React, { useEffect, useRef } from "react";
import { useMorphStore } from "../../store/useMorphStore";

interface BlobCanvasProps {
  interactive?: boolean;
}

export default function BlobCanvas({ interactive = true }: BlobCanvasProps) {
  const store = useMorphStore();
  
  // If interactive, use store values. If not (Landing Page), use defaults.
  const complexity = interactive ? store.complexity : 20;
  const contrast = interactive ? store.contrast : 30;
  const motionSpeed = interactive ? store.motionSpeed : 5;
  const fillColor = interactive ? store.fillColor : "#ffffff";

  const pathRef = useRef<SVGPathElement>(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const render = () => {
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
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      <svg 
        width="100%" 
        height="100%" 
        viewBox="-120 -120 240 240" 
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
            <filter id="glass-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <path
            ref={pathRef}
            fill="rgba(255, 255, 255, 0.01)" 
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.5"
            filter="url(#glass-glow)"
            className="transition-all duration-500 ease-out"
        />
        {/* Inner Highlight for Volume */}
        <path
            d={generateBlobPath(timeRef.current, complexity, contrast)} 
            fill="none"
            stroke={fillColor}
            strokeOpacity="0.2"
            strokeWidth="0.5"
            transform="scale(0.95)"
        />
      </svg>
    </div>
  );
}

function generateBlobPath(time: number, complexity: number, contrast: number) {
    const pointsCount = 128; 
    const baseRadius = 65; 
    const points: [number, number][] = [];
    
    const baseFreq = 2 + (complexity / 100) * 8; 
    const maxAmp = 5 + (contrast / 100) * 35;

    for (let i = 0; i < pointsCount; i++) {
        const angle = (i / pointsCount) * Math.PI * 2;
        
        const n1 = Math.sin(angle * baseFreq + time);
        const n2 = Math.sin(angle * (baseFreq * 2) - time * 1.5);
        const n3 = Math.sin(angle * (baseFreq * 3) + time * 0.5);

        const noise = (n1 * 0.6) + (n2 * 0.3) + (n3 * 0.1);
        const r = baseRadius + (noise * maxAmp);

        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        points.push([x, y]);
    }

    return spline(points, 1, true);
}

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