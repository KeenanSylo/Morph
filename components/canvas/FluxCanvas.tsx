import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useMorphStore } from '../../store/useMorphStore';

// --- Type Definitions for Shader ---
declare global {
  namespace JSX {
    interface IntrinsicElements {
      fluxMaterial: any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        fluxMaterial: any;
      }
    }
  }
}

// --- Shader Material ---
const FluxMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#F59E0B'),
    uColor2: new THREE.Color('#DC2626'),
    uSize: 1.5,
    uChaos: 30.0,
    uSpeed: 0.5,
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uSize;
    uniform float uChaos;
    uniform float uSpeed;
    attribute vec3 randoms; // x=offset, y=speedVar, z=scaleVar
    varying float vAlpha;
    varying vec3 vColor;
    
    uniform vec3 uColor1;
    uniform vec3 uColor2;

    // Simplex Noise (Simplified)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
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
      // Base Loop
      vec3 pos = position;
      
      // Flow Logic
      float t = uTime * uSpeed * (0.5 + randoms.y * 0.5);
      
      // Apply noise flow
      float noise = snoise(pos.xy * 0.05 + t * 0.1);
      
      // Turbulence
      pos.x += sin(pos.y * 0.1 + t + noise * uChaos * 0.1);
      pos.y += cos(pos.x * 0.1 + t + noise * uChaos * 0.1);
      pos.z += sin(pos.x * 0.2 + t) * (uChaos * 0.1);

      // Depth fading
      vAlpha = 1.0 - smoothstep(15.0, 40.0, abs(pos.z));
      
      // Color mixing based on noise
      vColor = mix(uColor1, uColor2, smoothstep(-1.0, 1.0, noise));

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uSize * (200.0 / -mvPosition.z) * (0.5 + randoms.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      // Circular particle
      vec2 uv = gl_PointCoord.xy - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;
      
      // Soft Glow
      float glow = 1.0 - smoothstep(0.0, 0.5, d);
      glow = pow(glow, 2.0); // Sharpen core

      gl_FragColor = vec4(vColor, vAlpha * glow);
    }
  `
);

extend({ FluxMaterial });

// --- Particle Field Component ---
const Particles = () => {
    const { fluxCount, fluxSpeed, fluxSize, fluxChaos, gradientColors, isPaused } = useMorphStore();
    const materialRef = useRef<any>(null);
    const pointsRef = useRef<THREE.Points>(null);

    // Generate Particles Buffer
    const { positions, randoms } = useMemo(() => {
        const positions = new Float32Array(fluxCount * 3);
        const randoms = new Float32Array(fluxCount * 3);
        
        for (let i = 0; i < fluxCount; i++) {
            // Spread particles in a large cube
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            randoms[i * 3] = Math.random();
            randoms[i * 3 + 1] = Math.random();
            randoms[i * 3 + 2] = Math.random();
        }
        return { positions, randoms };
    }, [fluxCount]);

    useFrame((state, delta) => {
        if (!materialRef.current) return;
        if (!isPaused) {
            materialRef.current.uTime += delta;
        }
        materialRef.current.uSpeed = fluxSpeed;
        materialRef.current.uSize = fluxSize;
        materialRef.current.uChaos = fluxChaos;
        materialRef.current.uColor1.set(gradientColors[0]);
        materialRef.current.uColor2.set(gradientColors[1]);
    });

    return (
        <points ref={pointsRef} key={fluxCount}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={fluxCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-randoms"
                    count={fluxCount}
                    array={randoms}
                    itemSize={3}
                />
            </bufferGeometry>
            {/* @ts-ignore */}
            <fluxMaterial 
                ref={materialRef} 
                transparent 
                depthWrite={false} 
                blending={THREE.AdditiveBlending} 
            />
        </points>
    );
};

export default function FluxCanvas() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas 
                id="flux-canvas-node" 
                gl={{ preserveDrawingBuffer: true, antialias: true }}
                camera={{ position: [0, 0, 30], fov: 60 }}
            >
                <Particles />
                <OrbitControls 
                    enableZoom={false} 
                    // Disabled autoRotate to prevent showing empty sides
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 1.5} 
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
}