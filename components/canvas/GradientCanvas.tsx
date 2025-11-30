import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import * as THREE from 'three';
import './GradientShaderMaterial';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gradientShaderMaterial: any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        gradientShaderMaterial: any;
      }
    }
  }
}

interface GradientCanvasProps {
  colors: string[];
  noiseScale: number;
}

const GradientScene = ({ colors, noiseScale }: GradientCanvasProps) => {
  const materialRef = useRef<any>(null);
  const { viewport } = useThree(); // Get current viewport dimensions

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
      materialRef.current.uNoiseScale = noiseScale;
      // Optimize: Only create new Color objects if necessary, though simpler here to just assign
      materialRef.current.uColor1.set(colors[0]);
      materialRef.current.uColor2.set(colors[1]);
      materialRef.current.uColor3.set(colors[2]);
      materialRef.current.uColor4.set(colors[3]);
    }
  });

  return (
    // Scale plane to match viewport exactly (fullscreen background)
    <Plane args={[1, 1]} scale={[viewport.width, viewport.height, 1]}>
      <gradientShaderMaterial 
        ref={materialRef} 
        uColor1={new THREE.Color(colors[0])}
        uColor2={new THREE.Color(colors[1])}
        uColor3={new THREE.Color(colors[2])}
        uColor4={new THREE.Color(colors[3])}
        uNoiseScale={noiseScale}
      />
    </Plane>
  );
};

export default function GradientCanvas({ colors, noiseScale }: GradientCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas 
        camera={{ position: [0, 0, 1] }} 
        resize={{ scroll: false }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <GradientScene colors={colors} noiseScale={noiseScale} />
      </Canvas>
    </div>
  );
}