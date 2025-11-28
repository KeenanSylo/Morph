import React from "react";
import { useMorphStore } from "../store/useMorphStore";
import { GlassPanel } from "./ui/GlassPanel";

export default function ControlDeck() {
  const {
    complexity, setComplexity,
    contrast, setContrast,
    motionSpeed, setMotionSpeed,
    fillColor, setFillColor
  } = useMorphStore();

  return (
    <GlassPanel className="fixed right-4 top-4 bottom-4 w-80 p-6 flex flex-col gap-8 z-10 overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">Morph</h2>
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Generator</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Complexity Control */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm items-center">
            <label className="text-white/80 font-medium">Complexity</label>
            <span className="font-mono text-xs text-white/40 bg-white/5 px-2 py-1 rounded border border-white/5">{complexity}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={complexity}
            onChange={(e) => setComplexity(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all outline-none"
          />
        </div>

        {/* Contrast Control */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm items-center">
            <label className="text-white/80 font-medium">Contrast</label>
            <span className="font-mono text-xs text-white/40 bg-white/5 px-2 py-1 rounded border border-white/5">{contrast}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all outline-none"
          />
        </div>

        {/* Motion Speed Control */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm items-center">
            <label className="text-white/80 font-medium">Motion Speed</label>
            <span className="font-mono text-xs text-white/40 bg-white/5 px-2 py-1 rounded border border-white/5">{motionSpeed}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={motionSpeed}
            onChange={(e) => setMotionSpeed(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all outline-none"
          />
        </div>

         {/* Color Control */}
         <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex justify-between text-sm items-center">
            <label className="text-white/80 font-medium">Fill Tint</label>
            <span className="font-mono text-xs text-white/40 uppercase">{fillColor}</span>
          </div>
          <div className="flex items-center gap-3">
              <div className="relative w-full h-12 rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-white/30 transition-all group">
                <input
                type="color"
                value={fillColor}
                onChange={(e) => setFillColor(e.target.value)}
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 border-0"
                />
              </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-6 text-[10px] text-white/20 text-center">
        v1.0.0 • AI Build
      </div>
    </GlassPanel>
  );
}