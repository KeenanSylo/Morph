import { create } from 'zustand';

interface MorphState {
  shapeMode: 'blob' | 'wave';
  
  // New Shape Params
  chaos: number;      // 0-100: Amplitude of distortion (Replaces Complexity)
  smoothness: number; // 3-20: Vertex count (Replaces internal point count logic)
  warp: number;       // 0-100: Noise frequency (Replaces hardcoded freq)
  motionSpeed: number; // 0-100

  // Style Properties
  fillType: 'solid' | 'linear' | 'radial';
  gradientColors: string[]; // [Color1, Color2]
  glowIntensity: number; // 0 to 100
  
  showSafeZone: boolean;
  isPaused: boolean;
  darkMode: boolean; // New Theme State
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
  // Deep Ember Theme: Amber-500 to Red-600
  gradientColors: ['#F59E0B', '#DC2626'], 
  glowIntensity: 20,
  
  showSafeZone: false,
  isPaused: false,
  darkMode: false, // Default to Light Mode

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
  
  setShowSafeZone: (show) => set({ showSafeZone: show }),
  setIsPaused: (paused) => set({ isPaused: paused }),
  setDarkMode: (dark) => set({ darkMode: dark }),
  
  randomize: () => set(() => {
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    return {
      chaos: 10 + Math.floor(Math.random() * 70),
      smoothness: 6 + Math.floor(Math.random() * 8), 
      warp: 20 + Math.floor(Math.random() * 60),
      fillType: Math.random() > 0.5 ? 'linear' : 'radial',
      gradientColors: [randomColor(), randomColor()],
      glowIntensity: 10 + Math.floor(Math.random() * 50),
    };
  }),
}));