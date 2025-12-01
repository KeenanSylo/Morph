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

  // Neo-Grid Tool Params
  gridSize: number;
  gridDistortion: number;
  gridSpeed: number;
  
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

  // Grid Setters
  setGridSize: (val: number) => void;
  setGridDistortion: (val: number) => void;
  setGridSpeed: (val: number) => void;
  
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
  waveHeight: 40,    // Reduced from 50
  waveFrequency: 12, // Reduced from 20 for smoother initial look
  waveCurve: 'sine',

  // Grid Defaults
  gridSize: 20,
  gridDistortion: 50,
  gridSpeed: 1.0,
  
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

  setGridSize: (val) => set({ gridSize: val }),
  setGridDistortion: (val) => set({ gridDistortion: val }),
  setGridSpeed: (val) => set({ gridSpeed: val }),
  
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
      waveHeight: 20 + Math.floor(Math.random() * 60),
      waveFrequency: 5 + Math.floor(Math.random() * 25),
      gridDistortion: Math.random() * 100,
    };
  }),
}));