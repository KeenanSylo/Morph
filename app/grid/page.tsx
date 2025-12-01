import React, { useState } from "react";
import GridCanvas from "../../components/canvas/GridCanvas";
import ActionBar from "../../components/ActionBar";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useMorphStore } from "../../store/useMorphStore";
import { cn } from "../../lib/utils";
import { GlassPanel } from "../../components/ui/GlassPanel";

const GridControls = () => {
    const { 
        gridSize, setGridSize,
        gridDistortion, setGridDistortion,
        gridSpeed, setGridSpeed,
        gradientColors, setGradientColor,
        darkMode
    } = useMorphStore();

    const labelClass = darkMode ? "text-neutral-400" : "text-slate-600";
    const accentClass = darkMode ? "bg-white/10 accent-orange-500" : "bg-slate-200 accent-blue-600";

    return (
        <div className="p-5 space-y-6">
             <div className="space-y-2">
                <label className={cn("text-xs font-medium", labelClass)}>Grid Size</label>
                <input type="range" min="10" max="50" value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
            </div>
             <div className="space-y-2">
                <label className={cn("text-xs font-medium", labelClass)}>Distortion</label>
                <input type="range" min="0" max="100" value={gridDistortion} onChange={(e) => setGridDistortion(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
            </div>
             <div className="space-y-2">
                <label className={cn("text-xs font-medium", labelClass)}>Animation Speed</label>
                <input type="range" min="0" max="5" step="0.1" value={gridSpeed} onChange={(e) => setGridSpeed(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
            </div>
            
             <div className="space-y-2 border-t border-white/5 pt-4">
                <label className={cn("text-xs font-medium", labelClass)}>Color Map</label>
                <div className="flex gap-2">
                     <input type="color" value={gradientColors[0]} onChange={(e) => setGradientColor(0, e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                     <input type="color" value={gradientColors[1]} onChange={(e) => setGradientColor(1, e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                </div>
            </div>
        </div>
    );
}

export default function GridPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { darkMode } = useMorphStore();

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(async () => {
      const canvas = document.querySelector("#grid-canvas-node canvas") as HTMLCanvasElement;
      if (canvas) {
          const dataUrl = canvas.toDataURL("image/png");
          download(dataUrl, "morph-grid.png");
          setIsExporting(false);
      }
    }, 100);
  };

  return (
    <main className={cn("relative h-screen w-full overflow-hidden", darkMode ? "bg-black" : "bg-white")}>
      <GridCanvas />
      
      {!isExporting && (
        <>
          <ActionBar onDownload={handleDownload} />
          {/* Custom Sidebar for Grid */}
          <div className="fixed top-20 right-4 w-72">
             <GlassPanel className={cn("h-auto", darkMode ? "bg-black/60 border-white/5" : "bg-white/70")}>
                <div className="p-4 border-b border-white/5 font-bold text-sm text-neutral-300">Grid Controls</div>
                <GridControls />
             </GlassPanel>
          </div>
        </>
      )}
    </main>
  );
}