import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useMorphStore } from '../../store/useMorphStore';

// Curve Gradient Shader Material
class CurveGradientMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(1024, 1024) },
        u_expand: { value: 6.0 },
        u_random: { value: Math.random() },
        u_scale: { value: 1.0 },
        u_density: { value: 1.0 },
        u_speed: { value: 1.0 },
        u_noise: { value: 0.1 },
        u_color_0: { value: new THREE.Color('#f59e0b') },
        u_color_1: { value: new THREE.Color('#dc2626') },
        u_color_2: { value: new THREE.Color('#7c3aed') },
        u_color_3: { value: new THREE.Color('#0f172a') },
        u_color_4: { value: new THREE.Color('#1e293b') },
        u_color_5: { value: new THREE.Color('#334155') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform float u_expand;
        uniform float u_random;
        uniform float u_scale;
        uniform float u_density;
        uniform float u_noise;
        uniform vec3 u_color_0;
        uniform vec3 u_color_1;
        uniform vec3 u_color_2;
        uniform vec3 u_color_3;
        uniform vec3 u_color_4;
        uniform vec3 u_color_5;
        
        varying vec2 vUv;
        
        // Noise function
        float random(vec2 co) {
          return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        // 2D Noise
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        // Fractal Brownian Motion
        float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(st * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        // Smooth curve function
        float smoothCurve(float t) {
          return t * t * (3.0 - 2.0 * t);
        }
        
        void main() {
          vec2 st = vUv;
          vec2 resolution = u_resolution * u_scale;
          
          // Create animated curve patterns
          float time = u_time * 0.5;
          vec2 pos = st * u_expand + vec2(u_random * 10.0);
          
          // Multiple layers of noise for complexity
          float n1 = fbm(pos + time * 0.3);
          float n2 = fbm(pos * 2.0 - time * 0.2);
          float n3 = fbm(pos * 0.5 + time * 0.4);
          
          // Combine noise patterns to create curves
          float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
          pattern = smoothCurve(pattern);
          
          // Create color zones with smooth transitions
          float zone = pattern * 5.0 + sin(st.x * 3.14159 + time) * 0.5;
          zone = fract(zone * u_density);
          
          // Blend between 6 colors based on the pattern
          vec3 color;
          if (zone < 0.166) {
            float t = zone / 0.166;
            color = mix(u_color_0, u_color_1, smoothCurve(t));
          } else if (zone < 0.333) {
            float t = (zone - 0.166) / 0.167;
            color = mix(u_color_1, u_color_2, smoothCurve(t));
          } else if (zone < 0.5) {
            float t = (zone - 0.333) / 0.167;
            color = mix(u_color_2, u_color_3, smoothCurve(t));
          } else if (zone < 0.666) {
            float t = (zone - 0.5) / 0.166;
            color = mix(u_color_3, u_color_4, smoothCurve(t));
          } else if (zone < 0.833) {
            float t = (zone - 0.666) / 0.167;
            color = mix(u_color_4, u_color_5, smoothCurve(t));
          } else {
            float t = (zone - 0.833) / 0.167;
            color = mix(u_color_5, u_color_0, smoothCurve(t));
          }
          
          // Add film grain noise
          float grain = (random(vUv + time * 0.1) - 0.5) * u_noise;
          color = color + color * grain;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }
}

extend({ CurveGradientMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    curveGradientMaterial: any;
  }
}

const CurveGradientPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const {
    curveColors,
    curveSpeed,
    curveScale,
    curveDensity,
    curveExpand,
    curveNoise,
    isPaused,
  } = useMorphStore();

  const material = useMemo(() => new CurveGradientMaterial(), []);

  useFrame((state, delta) => {
    if (!material || isPaused) return;
    
    material.uniforms.u_time.value += delta * curveSpeed;
    material.uniforms.u_scale.value = curveScale;
    material.uniforms.u_density.value = curveDensity;
    material.uniforms.u_expand.value = curveExpand;
    material.uniforms.u_noise.value = curveNoise;
    
    // Update colors
    for (let i = 0; i < 6; i++) {
      material.uniforms[`u_color_${i}`].value.set(curveColors[i]);
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[10, 10]} />
    </mesh>
  );
};

export default function CurveGradientCanvas() {
  const { darkMode } = useMorphStore();

  return (
    <div className="absolute inset-0 z-0" id="curve-gradient-capture">
      <Canvas
        id="curve-canvas"
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: darkMode ? '#000000' : '#ffffff' }}
      >
        <CurveGradientPlane />
      </Canvas>
    </div>
  );
}
