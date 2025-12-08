import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useMorphStore } from '../../store/useMorphStore';

// Curve Gradient Shader Material - Silk-like smooth gradients
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
        u_color_0: { value: new THREE.Color('#e0f2fe') },
        u_color_1: { value: new THREE.Color('#ddd6fe') },
        u_color_2: { value: new THREE.Color('#fce7f3') },
        u_color_3: { value: new THREE.Color('#bfdbfe') },
        u_color_4: { value: new THREE.Color('#fbcfe8') },
        u_color_5: { value: new THREE.Color('#e9d5ff') },
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
        
        // Ultra-smooth interpolation (Ken Perlin's smootherstep)
        float smootherstep(float edge0, float edge1, float x) {
          x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
          return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
        }
        
        // Hash for smooth noise
        vec2 hash2(vec2 p) {
          p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
          return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
        }
        
        // Smooth Perlin-like noise
        float perlinNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(
            mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
            mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
            u.y) * 0.5 + 0.5;
        }
        
        // Layered noise for organic patterns
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 4; i++) {
            value += amplitude * perlinNoise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec2 uv = vUv;
          float time = u_time * 0.1;
          
          // Gentle noise for organic flow
          float noise = fbm(uv * u_expand * 0.3 + vec2(time * 0.08, time * 0.06)) * 0.5 + 0.5;
          
          // Create diagonal flowing ribbons
          vec2 flow = uv;
          flow.x += sin(uv.y * 2.5 + time + noise * 1.5) * 0.2;
          flow.y += cos(uv.x * 2.0 - time * 0.8 + noise * 1.5) * 0.15;
          
          // Main ribbon pattern - diagonal waves creating silk folds
          float ribbonPattern = sin(flow.x * u_expand + flow.y * u_expand * 0.6 + time);
          
          // Sharp, defined ribbon edges
          float ribbonValue = fract(ribbonPattern * u_density * 0.5 + 0.5);
          
          // Create the 3D fold effect with sharp highlights and shadows
          float fold = sin(ribbonValue * 3.14159);
          fold = pow(fold, 0.7); // Sharper peaks
          
          // Define clear highlights (top of folds) and shadows (valleys)
          float lighting = fold * 0.5 + 0.5;
          lighting = smootherstep(0.3, 0.7, lighting);
          
          // Map color based on position
          float colorPos = ribbonValue;
          colorPos = smootherstep(0.0, 1.0, colorPos);
          
          // Blend through all 6 colors
          float t = colorPos * 5.0;
          vec3 baseColor;
          
          if (t < 1.0) {
            baseColor = mix(u_color_0, u_color_1, smootherstep(0.0, 1.0, t));
          } else if (t < 2.0) {
            baseColor = mix(u_color_1, u_color_2, smootherstep(0.0, 1.0, t - 1.0));
          } else if (t < 3.0) {
            baseColor = mix(u_color_2, u_color_3, smootherstep(0.0, 1.0, t - 2.0));
          } else if (t < 4.0) {
            baseColor = mix(u_color_3, u_color_4, smootherstep(0.0, 1.0, t - 3.0));
          } else {
            baseColor = mix(u_color_4, u_color_5, smootherstep(0.0, 1.0, t - 4.0));
          }
          
          // Apply 3D lighting to create silk sheet appearance
          vec3 color = baseColor * lighting;
          
          // Add bright highlights on fold peaks
          float highlight = smoothstep(0.85, 1.0, fold) * 0.3;
          color += vec3(highlight);
          
          // Add shadows in valleys
          float shadow = smoothstep(0.0, 0.2, fold);
          color = mix(color * 0.6, color, shadow);
          
          // Subtle ambient occlusion in creases
          float ao = smoothstep(0.4, 0.6, fold) * 0.1 + 0.9;
          color *= ao;
          
          // Very minimal grain
          float grain = fract(sin(dot(uv + time * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
          color += (grain - 0.5) * u_noise * 0.01;
          
          color = clamp(color, 0.0, 1.0);
          
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
