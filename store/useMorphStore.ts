import { create } from 'zustand';

interface MorphState {
  shapeMode: 'blob' | 'wave';
  complexity: number;
  contrast: number;
  motionSpeed: number;
  fillColor: string;
  showSafeZone: boolean;
}

interface MorphActions {
  setShapeMode: (mode: 'blob' | 'wave') => void;
  setComplexity: (val: number) => void;
  setContrast: (val: number) => void;
  setMotionSpeed: (val: number) => void;
  setFillColor: (color: string) => void;
  setShowSafeZone: (show: boolean) => void;
  randomize: () => void;
}

export const useMorphStore = create<MorphState & MorphActions>((set) => ({
  shapeMode: 'blob',
  complexity: 30,
  contrast: 50,
  motionSpeed: 10,
  fillColor: '#3b82f6', // blue-500
  showSafeZone: false,

  setShapeMode: (mode) => set({ shapeMode: mode }),
  setComplexity: (val) => set({ complexity: val }),
  setContrast: (val) => set({ contrast: val }),
  setMotionSpeed: (val) => set({ motionSpeed: val }),
  setFillColor: (color) => set({ fillColor: color }),
  setShowSafeZone: (show) => set({ showSafeZone: show }),
  
  randomize: () => set((state) => ({
    complexity: Math.floor(Math.random() * 100),
    contrast: Math.floor(Math.random() * 100),
    fillColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
  })),
}));
