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

interface GradientCodeGenProps {
  colors: string[];
  noiseScale: number;
}

export function getGradientCode({ colors, noiseScale }: GradientCodeGenProps): string {
  return `
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Plane, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// --- Shader Definition ---
const GradientShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('${colors[0]}'),
    uColor2: new THREE.Color('${colors[1]}'),
    uColor3: new THREE.Color('${colors[2]}'),
    uColor4: new THREE.Color('${colors[3]}'),
    uNoiseScale: ${noiseScale},
  },
  // Vertex Shader
  \`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \`,
  // Fragment Shader
  \`
    precision mediump float;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uNoiseScale;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.15;
      float n1 = snoise(uv * uNoiseScale * 0.5 + vec2(t * 0.2, t * 0.1));
      float n2 = snoise(uv * uNoiseScale * 1.5 - vec2(t * 0.3, t * 0.4));
      vec2 distortedUV = uv + vec2(n1, n2) * 0.3;
      vec3 top = mix(uColor1, uColor2, smoothstep(0.0, 1.0, distortedUV.x));
      vec3 bot = mix(uColor3, uColor4, smoothstep(0.0, 1.0, distortedUV.x));
      vec3 finalColor = mix(bot, top, smoothstep(0.0, 1.0, distortedUV.y));
      float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      finalColor += grain * 0.04;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  \`
);

extend({ GradientShaderMaterial });

// --- Scene Component ---
export default function GradientBackground() {
  const materialRef = useRef();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }
  });

  return (
    <Canvas camera={{ position: [0, 0, 1] }} resize={{ scroll: false }}>
      <mesh scale={[10, 10, 1]}>
        <planeGeometry args={[2, 2]} />
        <gradientShaderMaterial ref={materialRef} />
      </mesh>
    </Canvas>
  );
}
`.trim();
}