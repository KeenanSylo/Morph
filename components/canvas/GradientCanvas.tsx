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
  gradientSpeed: number;
  loopDuration: number;
  isPaused: boolean;
}

const GradientScene = ({ colors, noiseScale, gradientSpeed, loopDuration, isPaused }: GradientCanvasProps) => {
  const materialRef = useRef<any>(null);
  const { viewport } = useThree(); 

  useFrame((state, delta) => {
    if (materialRef.current) {
      if (!isPaused) {
        // Increment time manually to allow pausing
        materialRef.current.uTime += delta;
      }
      
      materialRef.current.uNoiseScale = noiseScale;
      materialRef.current.uSpeed = gradientSpeed;
      materialRef.current.uLoopDuration = loopDuration;
      
      // Update colors
      materialRef.current.uColor1.set(colors[0]);
      materialRef.current.uColor2.set(colors[1]);
      materialRef.current.uColor3.set(colors[2]);
      materialRef.current.uColor4.set(colors[3]);
    }
  });

  return (
    <Plane args={[1, 1]} scale={[viewport.width, viewport.height, 1]}>
      <gradientShaderMaterial 
        ref={materialRef} 
        uColor1={new THREE.Color(colors[0])}
        uColor2={new THREE.Color(colors[1])}
        uColor3={new THREE.Color(colors[2])}
        uColor4={new THREE.Color(colors[3])}
        uNoiseScale={noiseScale}
        uSpeed={gradientSpeed}
        uLoopDuration={loopDuration}
      />
    </Plane>
  );
};

export default function GradientCanvas({ colors, noiseScale, gradientSpeed, loopDuration, isPaused }: GradientCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas 
        // ID used for video capture
        id="gradient-canvas-node"
        camera={{ position: [0, 0, 1] }} 
        resize={{ scroll: false }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <GradientScene 
            colors={colors} 
            noiseScale={noiseScale} 
            gradientSpeed={gradientSpeed} 
            loopDuration={loopDuration}
            isPaused={isPaused} 
        />
      </Canvas>
    </div>
  );
}