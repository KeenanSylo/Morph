import { create } from 'zustand';

interface MorphState {
  shapeMode: 'blob' | 'wave';
  
  // Blob Tool Params
  chaos: number;
  smoothness: number;
  warp: number;
  motionSpeed: number;

  // Blob/Wave Style Properties
  fillType: 'solid' | 'linear' | 'radial';
  gradientColors: string[];
  glowIntensity: number;
  
  // Gradient Blur Tool Params
  blurColors: string[];
  noiseScale: number;
  gradientSpeed: number;
  loopDuration: number;
  
  // Wave Tool Params
  waveLayers: number;
  waveHeight: number;
  waveFrequency: number;
  waveCurve: 'sine' | 'step' | 'sawtooth';
  waveSpacing: number;   // New: Distance between layers
  wavePhase: number;     // New: Offset between layers
  waveRoughness: number; // New: Secondary noise detail
  baseHeight: number;    // New: Controls the vertical position of the bottom wave

  // Grid Tool Params
  gridSize: number;
  gridDistortion: number;
  gridSpeed: number;

  // Flux Field Tool Params
  fluxCount: number;     // 100 to 10000
  fluxSpeed: number;     // Flow velocity
  fluxSize: number;      // Particle size
  fluxChaos: number;     // Turbulence amount
  
  // Particle Swarm Params
  swarmCount: number;    // Number of particles
  swarmSpeed: number;    // Movement speed
  swarmCohesion: number; // Attraction to center
  swarmSeparation: number; // Avoidance distance
  swarmTrailLength: number; // Trail effect
  swarmSize: number;     // Particle size
  
  // Spiral Galaxy Params
  spiralArms: number;    // Number of spiral arms
  spiralTightness: number; // How tight the spiral
  spiralParticles: number; // Particles per arm
  spiralRotation: number; // Rotation speed
  spiralThickness: number; // Arm thickness
  spiralGlow: number;    // Glow intensity
  
  // Noise Field Params
  noiseOctaves: number;  // Detail levels
  noiseFrequency: number; // Pattern frequency
  noisePersistence: number; // Amplitude falloff
  noiseLacunarity: number; // Frequency multiplier
  noiseAnimation: number; // Animation speed
  noiseContrast: number; // Value contrast
  
  // Mesh Morph Params
  meshComplexity: number; // Vertex count
  morphIntensity: number; // Displacement amount
  morphSpeed: number;    // Animation speed
  morphWaveCount: number; // Wave patterns
  meshWireframe: boolean; // Wireframe mode
  meshMetalness: number; // Material metalness
  meshRoughness: number; // Material roughness (glossiness)
  meshColors: string[];  // Gradient colors for mesh
  meshColorCount: number; // Number of active colors (1-3)
  
  // Curve Gradient Params
  curveSpeed: number;    // Animation speed
  curveScale: number;    // Pattern scale
  curveDensity: number;  // Color density
  curveExpand: number;   // Curve expansion
  curveNoise: number;    // Film grain noise
  curveColors: string[]; // 6 gradient colors
  
  showSafeZone: boolean;
  isPaused: boolean;
  darkMode: boolean;
}

interface MorphActions {
  setShapeMode: (mode: 'blob' | 'wave') => void;
  
  setChaos: (val: number) => void;
  setSmoothness: (val: number) => void;
  setWarp: (val: number) => void;
  setMotionSpeed: (val: number) => void;
  
  setFillType: (type: 'solid' | 'linear' | 'radial') => void;
  setGradientColor: (index: number, color: string) => void;
  setGlowIntensity: (val: number) => void;
  
  setBlurColor: (index: number, color: string) => void;
  setNoiseScale: (val: number) => void;
  setGradientSpeed: (val: number) => void;
  setLoopDuration: (val: number) => void;

  // Wave Setters
  setWaveLayers: (val: number) => void;
  setWaveHeight: (val: number) => void;
  setWaveFrequency: (val: number) => void;
  setWaveCurve: (val: 'sine' | 'step' | 'sawtooth') => void;
  setWaveSpacing: (val: number) => void;
  setWavePhase: (val: number) => void;
  setWaveRoughness: (val: number) => void;
  setBaseHeight: (val: number) => void;

  // Grid Setters
  setGridSize: (val: number) => void;
  setGridDistortion: (val: number) => void;
  setGridSpeed: (val: number) => void;

  // Flux Setters
  setFluxCount: (val: number) => void;
  setFluxSpeed: (val: number) => void;
  setFluxSize: (val: number) => void;
  setFluxChaos: (val: number) => void;
  
  // Particle Swarm Setters
  setSwarmCount: (val: number) => void;
  setSwarmSpeed: (val: number) => void;
  setSwarmCohesion: (val: number) => void;
  setSwarmSeparation: (val: number) => void;
  setSwarmTrailLength: (val: number) => void;
  setSwarmSize: (val: number) => void;
  
  // Spiral Galaxy Setters
  setSpiralArms: (val: number) => void;
  setSpiralTightness: (val: number) => void;
  setSpiralParticles: (val: number) => void;
  setSpiralRotation: (val: number) => void;
  setSpiralThickness: (val: number) => void;
  setSpiralGlow: (val: number) => void;
  
  // Noise Field Setters
  setNoiseOctaves: (val: number) => void;
  setNoiseFrequency: (val: number) => void;
  setNoisePersistence: (val: number) => void;
  setNoiseLacunarity: (val: number) => void;
  setNoiseAnimation: (val: number) => void;
  setNoiseContrast: (val: number) => void;
  
  // Mesh Morph Setters
  setMeshComplexity: (val: number) => void;
  setMorphIntensity: (val: number) => void;
  setMorphSpeed: (val: number) => void;
  setMorphWaveCount: (val: number) => void;
  setMeshWireframe: (val: boolean) => void;
  setMeshMetalness: (val: number) => void;
  setMeshRoughness: (val: number) => void;
  setMeshColor: (index: number, color: string) => void;
  setMeshColorCount: (val: number) => void;
  
  // Curve Gradient Setters
  setCurveSpeed: (val: number) => void;
  setCurveScale: (val: number) => void;
  setCurveDensity: (val: number) => void;
  setCurveExpand: (val: number) => void;
  setCurveNoise: (val: number) => void;
  setCurveColor: (index: number, color: string) => void;
  
  setShowSafeZone: (show: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  randomize: () => void;
}

export const useMorphStore = create<MorphState & MorphActions>((set) => ({
  shapeMode: 'blob',
  
  // Blob Defaults
  chaos: 30,
  smoothness: 8,
  warp: 40,
  motionSpeed: 10,
  
  fillType: 'linear',
  gradientColors: ['#F59E0B', '#DC2626'], // Deep Ember Magma
  glowIntensity: 20,
  
  // Gradient Defaults
  blurColors: ['#0f172a', '#7c2d12', '#431407', '#000000'],
  noiseScale: 1.0,
  gradientSpeed: 1.0,
  loopDuration: 10,
  
  // Wave Defaults
  waveLayers: 4,
  waveHeight: 120,    
  waveFrequency: 3, 
  waveCurve: 'sine',
  waveSpacing: 100, // Default spacing
  wavePhase: 20,    // Default phase shift
  waveRoughness: 20,// Default roughness
  baseHeight: 150,  // Default bottom wave position

  // Grid Defaults
  gridSize: 30,
  gridDistortion: 50,
  gridSpeed: 1.0,

  // Flux Defaults
  fluxCount: 3000,
  fluxSpeed: 0.5,
  fluxSize: 1.5,
  fluxChaos: 30,
  
  // Particle Swarm Defaults
  swarmCount: 500,
  swarmSpeed: 1.5,
  swarmCohesion: 50,
  swarmSeparation: 30,
  swarmTrailLength: 20,
  swarmSize: 2,
  
  // Spiral Galaxy Defaults
  spiralArms: 3,
  spiralTightness: 50,
  spiralParticles: 1000,
  spiralRotation: 1,
  spiralThickness: 40,
  spiralGlow: 50,
  
  // Noise Field Defaults
  noiseOctaves: 4,
  noiseFrequency: 2,
  noisePersistence: 0.5,
  noiseLacunarity: 2,
  noiseAnimation: 1,
  noiseContrast: 50,
  
  // Mesh Morph Defaults
  meshComplexity: 50,
  morphIntensity: 50,
  morphSpeed: 1,
  morphWaveCount: 3,
  meshWireframe: false,
  meshMetalness: 50,
  meshRoughness: 30,
  meshColors: ['#f59e0b', '#dc2626', '#7c3aed'],
  meshColorCount: 3,
  
  // Curve Gradient Defaults
  curveSpeed: 1.0,
  curveScale: 1.0,
  curveDensity: 1.0,
  curveExpand: 6.0,
  curveNoise: 0.1,
  curveColors: ['#f59e0b', '#dc2626', '#7c3aed', '#0f172a', '#1e293b', '#334155'],
  
  showSafeZone: false,
  isPaused: false,
  darkMode: true,

  setShapeMode: (mode) => set({ shapeMode: mode }),
  
  setChaos: (val) => set({ chaos: val }),
  setSmoothness: (val) => set({ smoothness: val }),
  setWarp: (val) => set({ warp: val }),
  setMotionSpeed: (val) => set({ motionSpeed: val }),
  
  setFillType: (type) => set({ fillType: type }),
  setGradientColor: (index, color) => set((state) => {
    const newColors = [...state.gradientColors];
    newColors[index] = color;
    return { gradientColors: newColors };
  }),
  setGlowIntensity: (val) => set({ glowIntensity: val }),
  
  setBlurColor: (index, color) => set((state) => {
    const newColors = [...state.blurColors];
    newColors[index] = color;
    return { blurColors: newColors };
  }),
  setNoiseScale: (val) => set({ noiseScale: val }),
  setGradientSpeed: (val) => set({ gradientSpeed: val }),
  setLoopDuration: (val) => set({ loopDuration: val }),

  setWaveLayers: (val) => set({ waveLayers: val }),
  setWaveHeight: (val) => set({ waveHeight: val }),
  setWaveFrequency: (val) => set({ waveFrequency: val }),
  setWaveCurve: (val) => set({ waveCurve: val }),
  setWaveSpacing: (val) => set({ waveSpacing: val }),
  setWavePhase: (val) => set({ wavePhase: val }),
  setWaveRoughness: (val) => set({ waveRoughness: val }),
  setBaseHeight: (val) => set({ baseHeight: val }),

  setGridSize: (val) => set({ gridSize: val }),
  setGridDistortion: (val) => set({ gridDistortion: val }),
  setGridSpeed: (val) => set({ gridSpeed: val }),

  setFluxCount: (val) => set({ fluxCount: val }),
  setFluxSpeed: (val) => set({ fluxSpeed: val }),
  setFluxSize: (val) => set({ fluxSize: val }),
  setFluxChaos: (val) => set({ fluxChaos: val }),
  
  setSwarmCount: (val) => set({ swarmCount: val }),
  setSwarmSpeed: (val) => set({ swarmSpeed: val }),
  setSwarmCohesion: (val) => set({ swarmCohesion: val }),
  setSwarmSeparation: (val) => set({ swarmSeparation: val }),
  setSwarmTrailLength: (val) => set({ swarmTrailLength: val }),
  setSwarmSize: (val) => set({ swarmSize: val }),
  
  setSpiralArms: (val) => set({ spiralArms: val }),
  setSpiralTightness: (val) => set({ spiralTightness: val }),
  setSpiralParticles: (val) => set({ spiralParticles: val }),
  setSpiralRotation: (val) => set({ spiralRotation: val }),
  setSpiralThickness: (val) => set({ spiralThickness: val }),
  setSpiralGlow: (val) => set({ spiralGlow: val }),
  
  setNoiseOctaves: (val) => set({ noiseOctaves: val }),
  setNoiseFrequency: (val) => set({ noiseFrequency: val }),
  setNoisePersistence: (val) => set({ noisePersistence: val }),
  setNoiseLacunarity: (val) => set({ noiseLacunarity: val }),
  setNoiseAnimation: (val) => set({ noiseAnimation: val }),
  setNoiseContrast: (val) => set({ noiseContrast: val }),
  
  setMeshComplexity: (val) => set({ meshComplexity: val }),
  setMorphIntensity: (val) => set({ morphIntensity: val }),
  setMorphSpeed: (val) => set({ morphSpeed: val }),
  setMorphWaveCount: (val) => set({ morphWaveCount: val }),
  setMeshWireframe: (val) => set({ meshWireframe: val }),
  setMeshMetalness: (val) => set({ meshMetalness: val }),
  setMeshRoughness: (val) => set({ meshRoughness: val }),
  setMeshColor: (index, color) => set((state) => {
    const newColors = [...state.meshColors];
    newColors[index] = color;
    return { meshColors: newColors };
  }),
  setMeshColorCount: (val) => set({ meshColorCount: val }),
  
  setCurveSpeed: (val) => set({ curveSpeed: val }),
  setCurveScale: (val) => set({ curveScale: val }),
  setCurveDensity: (val) => set({ curveDensity: val }),
  setCurveExpand: (val) => set({ curveExpand: val }),
  setCurveNoise: (val) => set({ curveNoise: val }),
  setCurveColor: (index, color) => set((state) => {
    const newColors = [...state.curveColors];
    newColors[index] = color;
    return { curveColors: newColors };
  }),
  
  setShowSafeZone: (show) => set({ showSafeZone: show }),
  setIsPaused: (paused) => set({ isPaused: paused }),
  setDarkMode: (dark) => set({ darkMode: dark }),
  
  randomize: () => set((state) => {
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    return {
      chaos: 10 + Math.floor(Math.random() * 70),
      smoothness: 6 + Math.floor(Math.random() * 8), 
      warp: 20 + Math.floor(Math.random() * 60),
      fillType: Math.random() > 0.5 ? 'linear' : 'radial',
      gradientColors: [randomColor(), randomColor()],
      glowIntensity: 10 + Math.floor(Math.random() * 50),
      blurColors: [randomColor(), randomColor(), randomColor(), randomColor()],
      noiseScale: 0.5 + Math.random() * 2,
      gradientSpeed: 0.5 + Math.random() * 1.5,
      waveLayers: 3 + Math.floor(Math.random() * 5),
      
      waveHeight: 30 + Math.floor(Math.random() * 120), 
      waveFrequency: 2 + Math.floor(Math.random() * 6),
      waveSpacing: 30 + Math.floor(Math.random() * 100),
      wavePhase: Math.floor(Math.random() * 50),
      waveRoughness: Math.floor(Math.random() * 40),
      baseHeight: 50 + Math.floor(Math.random() * 200),
      
      gridSize: 20 + Math.floor(Math.random() * 30),
      gridDistortion: 20 + Math.floor(Math.random() * 80),
      gridSpeed: 0.5 + Math.random() * 2,

      // Randomize Flux Parameters
      fluxCount: 500 + Math.floor(Math.random() * 3200),
      fluxSpeed: 0.2 + Math.random() * 1.0,
      fluxChaos: 10 + Math.random() * 50,
      fluxSize: 1.0 + Math.random() * 2.0,
      
      // Randomize Particle Swarm
      swarmCount: 200 + Math.floor(Math.random() * 800),
      swarmSpeed: 0.5 + Math.random() * 2.5,
      swarmCohesion: 20 + Math.floor(Math.random() * 60),
      swarmSeparation: 10 + Math.floor(Math.random() * 50),
      swarmTrailLength: 10 + Math.floor(Math.random() * 40),
      swarmSize: 1 + Math.random() * 3,
      
      // Randomize Spiral Galaxy
      spiralArms: 2 + Math.floor(Math.random() * 5),
      spiralTightness: 20 + Math.floor(Math.random() * 80),
      spiralParticles: 500 + Math.floor(Math.random() * 1500),
      spiralRotation: 0.5 + Math.random() * 2,
      spiralThickness: 20 + Math.floor(Math.random() * 60),
      spiralGlow: 30 + Math.floor(Math.random() * 70),
      
      // Randomize Noise Field
      noiseOctaves: 3 + Math.floor(Math.random() * 5),
      noiseFrequency: 1 + Math.random() * 3,
      noisePersistence: 0.3 + Math.random() * 0.6,
      noiseLacunarity: 1.5 + Math.random() * 1.5,
      noiseAnimation: 0.5 + Math.random() * 2,
      noiseContrast: 30 + Math.floor(Math.random() * 60),
      
      // Randomize Mesh Morph
      meshComplexity: 30 + Math.floor(Math.random() * 60),
      morphIntensity: 30 + Math.floor(Math.random() * 70),
      morphSpeed: 0.5 + Math.random() * 2,
      morphWaveCount: 2 + Math.floor(Math.random() * 6),
      meshMetalness: 20 + Math.floor(Math.random() * 70),
      meshRoughness: 10 + Math.floor(Math.random() * 70),
      meshColors: [randomColor(), randomColor(), randomColor()],
      
      // Randomize Curve Gradient
      curveSpeed: 0.5 + Math.random() * 2.5,
      curveScale: 0.5 + Math.random() * 2.5,
      curveDensity: 0.5 + Math.random() * 2.5,
      curveExpand: 2 + Math.random() * 13,
      curveNoise: Math.random() * 0.3,
      curveColors: [randomColor(), randomColor(), randomColor(), randomColor(), randomColor(), randomColor()],
    };
  }),
}));