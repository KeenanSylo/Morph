import { create } from 'zustand';

interface MorphState {
  shapeMode: 'blob' | 'wave';
  
  // Blob Tool Params
  chaos: number;
  smoothness: number;
  warp: number;
  motionSpeed: number;

  // Blob Style Properties
  fillType: 'solid' | 'linear' | 'radial';
  gradientColors: string[];
  glowIntensity: number;
  
  // Gradient Blur Tool Params
  blurColors: string[];
  noiseScale: number;
  
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
  
  // Gradient Tool Actions
  setBlurColor: (index: number, color: string) => void;
  setNoiseScale: (val: number) => void;
  
  setShowSafeZone: (show: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  randomize: () => void;
}

export const useMorphStore = create<MorphState & MorphActions>((set) => ({
  shapeMode: 'blob',
  
  chaos: 30,
  smoothness: 8,
  warp: 40,
  motionSpeed: 10,
  
  fillType: 'linear',
  gradientColors: ['#F59E0B', '#DC2626'], 
  glowIntensity: 20,
  
  // Default values for Gradient Blur Tool (Deep Ember Theme)
  blurColors: ['#0f172a', '#7c2d12', '#431407', '#000000'],
  noiseScale: 1.5,
  
  showSafeZone: false,
  isPaused: false,
  darkMode: true, // Deep Ember defaults to dark

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
      // Randomize blur colors too if needed
      blurColors: [randomColor(), randomColor(), randomColor(), randomColor()],
      noiseScale: 0.5 + Math.random() * 2,
    };
  }),
}));