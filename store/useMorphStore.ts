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

  // Flux Field Tool Params (New)
  fluxCount: number;     // 100 to 10000
  fluxSpeed: number;     // Flow velocity
  fluxSize: number;      // Particle size
  fluxChaos: number;     // Turbulence amount
  
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
      // Cap density at 3700 as requested to prevent performance issues
      fluxCount: 500 + Math.floor(Math.random() * 3200),
      fluxSpeed: 0.2 + Math.random() * 1.0,
      fluxChaos: 10 + Math.random() * 50,
      fluxSize: 1.0 + Math.random() * 2.0,
    };
  }),
}));