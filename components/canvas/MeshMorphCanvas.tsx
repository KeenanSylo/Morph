import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useMorphStore } from "../../store/useMorphStore";

const MorphingSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const {
    meshComplexity,
    morphIntensity,
    morphSpeed,
    morphWaveCount,
    meshWireframe,
    meshMetalness,
    meshRoughness,
    meshColors,
    meshColorCount,
    isPaused,
  } = useMorphStore();

  const [originalPositions, setOriginalPositions] = React.useState<Float32Array | null>(null);

  const geometry = useMemo(() => {
    const segments = Math.max(10, Math.round(meshComplexity));
    const geo = new THREE.SphereGeometry(2, segments, segments);
    setOriginalPositions(new Float32Array(geo.attributes.position.array));
    
    // Add vertex colors for distinct color zones
    const colors = new Float32Array(geo.attributes.position.count * 3);
    const positions = geo.attributes.position;
    const activeColors = meshColors.slice(0, meshColorCount);
    
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const normalizedY = (y + 2) / 4; // Normalize to 0-1 range
      
      let color = new THREE.Color();
      
      if (meshColorCount === 1) {
        color.set(activeColors[0]);
      } else if (meshColorCount === 2) {
        color.lerpColors(
          new THREE.Color(activeColors[0]),
          new THREE.Color(activeColors[1]),
          normalizedY
        );
      } else {
        // 3 colors: create zones
        if (normalizedY < 0.33) {
          const t = normalizedY / 0.33;
          color.lerpColors(
            new THREE.Color(activeColors[0]),
            new THREE.Color(activeColors[1]),
            t
          );
        } else if (normalizedY < 0.66) {
          const t = (normalizedY - 0.33) / 0.33;
          color.lerpColors(
            new THREE.Color(activeColors[1]),
            new THREE.Color(activeColors[2]),
            t
          );
        } else {
          const t = (normalizedY - 0.66) / 0.34;
          color.lerpColors(
            new THREE.Color(activeColors[2]),
            new THREE.Color(activeColors[2]),
            t
          );
        }
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [meshComplexity, meshColors, meshColorCount]);

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      wireframe: meshWireframe,
      metalness: meshMetalness / 100,
      roughness: meshRoughness / 100,
      envMapIntensity: 2.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
    });
  }, [meshWireframe, meshMetalness, meshRoughness]);

  useFrame((state) => {
    if (!meshRef.current || !originalPositions || isPaused) return;

    const time = state.clock.getElapsedTime() * morphSpeed;
    const mesh = meshRef.current;
    const positions = geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < originalPositions.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];
      const z = originalPositions[i + 2];

      // Calculate distance from center
      const dist = Math.sqrt(x * x + y * y + z * z);

      // Multiple wave patterns
      let displacement = 0;
      for (let w = 0; w < morphWaveCount; w++) {
        const freq = (w + 1) * 0.5;
        displacement +=
          Math.sin(x * freq + time) *
          Math.cos(y * freq + time * 0.7) *
          Math.sin(z * freq + time * 0.5) *
          (1 / (w + 1));
      }

      displacement *= (morphIntensity / 100) * 0.3;

      // Apply displacement along normal direction
      const scale = 1 + displacement;
      positions.setXYZ(i / 3, x * scale, y * scale, z * scale);
    }

    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    // Rotate the mesh
    mesh.rotation.y += 0.003 * morphSpeed;
    mesh.rotation.x += 0.001 * morphSpeed;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
};

export default function MeshMorphCanvas() {
  const { darkMode, meshColors } = useMorphStore();

  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        id="mesh-canvas" 
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [0, 0, 6], fov: 50 }}
      >
        {/* @ts-ignore */}
        <color attach="background" args={[darkMode ? "#000000" : "#ffffff"]} />
        
        {/* Enhanced lighting for 3D depth */}
        <ambientLight intensity={0.3} />
        {/* @ts-ignore */}
        <directionalLight position={[5, 5, 5]} intensity={1.2} color={meshColors[0]} castShadow />
        {/* @ts-ignore */}
        <directionalLight position={[-5, -5, -5]} intensity={0.8} color={meshColors[1]} />
        <pointLight position={[0, 5, 3]} intensity={1.5} color={meshColors[2] || meshColors[0]} />
        <pointLight position={[5, 0, -3]} intensity={0.6} color="#ffffff" />
        {/* @ts-ignore */}
        <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.4} penumbra={1} castShadow />
        
        {/* Environment map for realistic reflections */}
        <Environment preset="city" background={false} />

        <MorphingSphere />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={false}
          minDistance={3}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
