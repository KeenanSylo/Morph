import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useMorphStore } from '../../store/useMorphStore';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      instancedMesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      pointLight: any;
      fog: any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        instancedMesh: any;
        boxGeometry: any;
        meshStandardMaterial: any;
        ambientLight: any;
        pointLight: any;
        fog: any;
      }
    }
  }
}

const Terrain = () => {
    const { gridSize, gridDistortion, gridSpeed, gradientColors, isPaused } = useMorphStore();
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = gridSize * gridSize;
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Color logic
    const color1 = new THREE.Color(gradientColors[0]);
    const color2 = new THREE.Color(gradientColors[1]);

    useFrame((state) => {
        if (!meshRef.current) return;
        
        const time = state.clock.getElapsedTime() * gridSpeed * 0.5;
        let i = 0;
        
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                // Calculate position relative to center
                const px = (x - gridSize / 2) * 1.5;
                const pz = (y - gridSize / 2) * 1.5;
                
                // Simplex-like noise function for height
                const height = Math.sin(px * 0.2 + time) * Math.cos(pz * 0.2 + time) * (gridDistortion / 10);
                
                dummy.position.set(px, height, pz);
                
                // Rotation adds a cool "digital" feel
                dummy.rotation.x = height * 0.2;
                dummy.rotation.z = height * 0.2;
                
                dummy.scale.setScalar(isPaused ? 1 : 1 + Math.sin(time + px) * 0.2);
                
                dummy.updateMatrix();
                meshRef.current.setMatrixAt(i, dummy.matrix);
                
                // Set color based on height
                const mixFactor = (height / (gridDistortion / 10) + 1) / 2;
                meshRef.current.setColorAt(i, color1.clone().lerp(color2, mixFactor));
                
                i++;
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[1, 0.2, 1]} />
            <meshStandardMaterial metalness={0.8} roughness={0.2} />
        </instancedMesh>
    );
};

export default function GridCanvas() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas id="grid-canvas-node" gl={{ preserveDrawingBuffer: true }}>
                <PerspectiveCamera makeDefault position={[0, 15, 30]} fov={50} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 20, 10]} intensity={2} color="#fb923c" />
                <pointLight position={[-10, 5, -10]} intensity={2} color="#dc2626" />
                
                <Terrain />
                
                {/* Auto Rotate controls */}
                <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} maxPolarAngle={Math.PI / 2.2} />
                
                {/* Fog for depth */}
                <fog attach="fog" args={['#000', 20, 60]} /> 
            </Canvas>
        </div>
    );
}