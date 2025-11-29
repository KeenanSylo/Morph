import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Shader definition
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Create organic movement
    float noise = sin(uv.x * 10.0 + uTime * 0.5) * cos(uv.y * 10.0 + uTime * 0.3);
    float noise2 = sin(uv.x * 5.0 - uTime * 0.2) * cos(uv.y * 5.0 + uTime * 0.1);
    
    float mixFactor = (noise + noise2) * 0.5 + 0.5;
    
    vec3 color = mix(uColor1, uColor2, uv.x + sin(uTime * 0.2) * 0.2);
    color = mix(color, uColor3, uv.y + cos(uTime * 0.3) * 0.2);
    
    // Add subtle grain/noise
    float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    color += grain * 0.05;

    gl_FragColor = vec4(color * mixFactor, 1.0);
  }
`;

function GradientPlane() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#1e1b4b") }, // Deep Indigo
      uColor2: { value: new THREE.Color("#172554") }, // Deep Blue
      uColor3: { value: new THREE.Color("#312e81") }, // Deep Purple
    },
    vertexShader,
    fragmentShader,
  }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={mesh} scale={[10, 10, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} args={[shaderArgs]} />
    </mesh>
  );
}

export default function FluidShader() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <GradientPlane />
      </Canvas>
    </div>
  );
}