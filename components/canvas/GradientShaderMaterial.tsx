import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// 1. Define the Shader Logic
const GradientShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#ff0000'),
    uColor2: new THREE.Color('#00ff00'),
    uColor3: new THREE.Color('#0000ff'),
    uColor4: new THREE.Color('#ffff00'),
    uNoiseScale: 1.0, // Acts as "Focus/Blur" size
    uSpeed: 1.0,      // Acts as "Amplitude" of the orbits
    uLoopDuration: 10.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (Orbital Diffusion)
  `
    precision mediump float;
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uNoiseScale;
    uniform float uSpeed;
    uniform float uLoopDuration;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Constants for math
      float PI = 3.14159265359;
      
      // Calculate phase based on Loop Duration for perfect periodicity
      // The angle goes from 0 to 2PI exactly over uLoopDuration seconds
      float theta = (uTime / uLoopDuration) * 2.0 * PI;
      
      // Define 4 Orbital Centers (Light Sources)
      // They move in perfect circles or Lissajous figures where frequencies are integers
      // uSpeed controls the Radius of the orbit (how much they move)
      float radius = 0.3 * uSpeed;
      
      // Source 1: Circular motion
      vec2 p1 = vec2(0.2, 0.2) + vec2(cos(theta), sin(theta)) * radius;
      
      // Source 2: Counter-circular, phase shifted
      vec2 p2 = vec2(0.8, 0.2) + vec2(cos(theta + PI), sin(theta - PI*0.5)) * radius;
      
      // Source 3: Vertical/Horizontal oscillation (2x frequency still loops perfectly)
      vec2 p3 = vec2(0.8, 0.8) + vec2(sin(theta), cos(theta)) * radius;
      
      // Source 4: Complex loop
      vec2 p4 = vec2(0.2, 0.8) + vec2(sin(theta + PI/2.0), cos(theta + PI)) * radius;
      
      // Calculate distances from UV to each source
      // We adjust aspect ratio influence slightly to keep it round-ish
      float d1 = distance(uv, p1);
      float d2 = distance(uv, p2);
      float d3 = distance(uv, p3);
      float d4 = distance(uv, p4);
      
      // Inverse Distance Weighting with "Blur" control (uNoiseScale)
      // Higher uNoiseScale = sharper dots. Lower = more diffuse.
      // We invert uNoiseScale so the slider feels intuitive (Higher scale = Big soft clouds)
      float sharpness = 5.0 / max(0.1, uNoiseScale); 
      
      float w1 = 1.0 / pow(d1, sharpness);
      float w2 = 1.0 / pow(d2, sharpness);
      float w3 = 1.0 / pow(d3, sharpness);
      float w4 = 1.0 / pow(d4, sharpness);
      
      // Sum weights
      float totalWeight = w1 + w2 + w3 + w4;
      
      // Blend colors
      vec3 finalColor = (uColor1 * w1 + uColor2 * w2 + uColor3 * w3 + uColor4 * w4) / totalWeight;
      
      // Add subtle dither to prevent banding
      float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
      finalColor += grain * 0.02;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ GradientShaderMaterial });

export { GradientShaderMaterial };