interface CodeGenProps {
  pathD: string;
  fillType: 'solid' | 'linear' | 'radial';
  colors: string[];
  glowIntensity: number;
}

export function getReactComponent({ pathD, fillType, colors, glowIntensity }: CodeGenProps): string {
  const gradientId = "morph-gradient";
  const glowId = "morph-glow";

  const defs = `
        <defs>
          <filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="${glowIntensity / 5}" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          ${fillType === 'linear' ? `
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="${colors[0]}" />
            <stop offset="100%" stopColor="${colors[1]}" />
          </linearGradient>` : ''}
          ${fillType === 'radial' ? `
          <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="${colors[0]}" />
            <stop offset="100%" stopColor="${colors[1]}" />
          </radialGradient>` : ''}
        </defs>
  `.trim();

  const fillAttr = fillType === 'solid' ? `fill="${colors[0]}"` : `fill="url(#${gradientId})"`;

  return `
import React from 'react';

export default function MorphBlob(props) {
  return (
    <svg 
      width="400" 
      height="400" 
      viewBox="-100 -100 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      ${defs}
      <path
        d="${pathD}"
        ${fillAttr}
        filter="url(#${glowId})"
      />
    </svg>
  );
}
  `.trim();
}
