import React, { useEffect, useRef, useState } from "react";
import { useMorphStore } from "../../store/useMorphStore";

interface WaveCanvasProps {
  interactive?: boolean;
}

export default function WaveCanvas({ interactive = true }: WaveCanvasProps) {
  const store = useMorphStore();
  
  const layers = interactive ? store.waveLayers : 4;
  const height = interactive ? store.waveHeight : 50;
  const freq = interactive ? store.waveFrequency : 20;
  const speed = interactive ? store.motionSpeed : 5;
  const spacing = interactive ? store.waveSpacing : 100;
  const phase = interactive ? store.wavePhase : 20;
  const roughness = interactive ? store.waveRoughness : 20;
  const baseHeight = interactive ? store.baseHeight : 150;
  
  const colors = interactive ? store.gradientColors : ['#F59E0B', '#DC2626'];
  const isPaused = interactive ? store.isPaused : false;

  const [paths, setPaths] = useState<string[]>([]);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const render = () => {
      if (!isPaused) {
        // Slow down time for gentler movement
        timeRef.current += speed * 0.001;
      }
      
      const newPaths: string[] = [];
      const width = 1000;
      const viewBoxHeight = 1000;
      
      // Generate points for Spline
      const pointsCount = 12; // Fewer points = smoother curves
      const spacingX = width / (pointsCount - 1);

      for (let i = 0; i < layers; i++) {
        // Vertical Position:
        // Start from bottom minus offset, then stack upwards based on spacing
        const yBase = viewBoxHeight - (i * spacing) - baseHeight;
        
        // Dynamic Amplitude: Much gentler progression for cohesive look
        const layerAmp = height * (0.6 + i * 0.1); 
        
        // Dynamic Frequency: Very subtle variation between layers
        const baseFreq = 0.002 + (freq / 10000); 
        const layerFreq = baseFreq * (1 + i * 0.05);
        
        // Phase shift: Gentler offset so waves move more together
        const layerPhase = i * (phase / 30) + timeRef.current;
        
        // Generate Control Points
        const points: [number, number][] = [];
        for (let j = 0; j < pointsCount; j++) {
            const x = j * spacingX;
            
            // Multi-Octave Sine for organic look
            // Wave 1: Main swell - reduced frequency for smoother waves
            const w1 = Math.sin(x * layerFreq * 3 + layerPhase);
            
            // Wave 2: Detail/Roughness - much more subtle
            const w2 = Math.sin(x * layerFreq * 11 + layerPhase * 1.5) * (roughness / 300);
            
            const noise = (w1 + w2); 
            const y = yBase + noise * layerAmp;
            
            points.push([x, y]);
        }

        // Generate smooth path string from points
        let path = spline(points, 1.0);
        
        // Close the shape to the bottom corners
        path += ` L ${width} ${viewBoxHeight} L 0 ${viewBoxHeight} Z`;
        
        newPaths.push(path);
      }
      
      // Reverse so back layers render first
      setPaths(newPaths.reverse()); 
      
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [layers, height, freq, speed, spacing, phase, roughness, baseHeight, isPaused]);

  // Interpolate colors helper
  const getLayerColor = (index: number) => {
    return index % 2 === 0 ? colors[0] : colors[1];
  };

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
      <svg 
        id="morph-svg-target"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000" 
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
        shapeRendering="geometricPrecision"
      >
        <defs>
            <linearGradient id="wave-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={colors[0]} />
                <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={getLayerColor(i)}
            fillOpacity={0.8 + (i / layers) * 0.2} 
            className="transition-colors duration-500"
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * Catmull-Rom Spline for open paths.
 * Converts control points to Cubic Bezier commands.
 */
function spline(points: [number, number][], tension: number = 1): string {
  const size = points.length;
  if (size === 0) return "";
  
  // Start path
  let path = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;

  // Helper to get point handling boundaries (clamp to ends)
  const getPoint = (i: number) => {
    if (i < 0) return points[0];
    if (i >= size) return points[size - 1];
    return points[i];
  };

  for (let i = 0; i < size - 1; i++) {
    const p0 = getPoint(i - 1);
    const p1 = getPoint(i);
    const p2 = getPoint(i + 1);
    const p3 = getPoint(i + 2);

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6 * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6 * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6 * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6 * tension;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  
  return path;
}