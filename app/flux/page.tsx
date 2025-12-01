import React, { useState } from "react";
import FluxCanvas from "../../components/canvas/FluxCanvas";
import ActionBar from "../../components/ActionBar";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useMorphStore } from "../../store/useMorphStore";
import { cn } from "../../lib/utils";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { ChevronRight, ChevronLeft } from "lucide-react";

const FluxControls = () => {
    const { 
        fluxCount, setFluxCount,
        fluxSpeed, setFluxSpeed,
        fluxSize, setFluxSize,
        fluxChaos, setFluxChaos,
        gradientColors, setGradientColor,
        darkMode
    } = useMorphStore();
    
    const [isCollapsed, setIsCollapsed] = useState(false);

    const labelClass = darkMode ? "text-neutral-400" : "text-slate-600";
    const accentClass = darkMode ? "bg-white/10 accent-orange-500" : "bg-slate-200 accent-blue-600";
    
    // Toggle Button Style
    const toggleClass = cn(
        "absolute left-0 top-1/2 -translate-x-[120%] -translate-y-1/2 p-2 backdrop-blur-md rounded-full border transition-colors",
        darkMode 
            ? "bg-black/40 border-white/5 text-neutral-400 hover:text-orange-400"
            : "bg-white/70 border-slate-200 text-slate-400 hover:text-blue-600"
    );

    return (
        <div className={cn(
            "fixed top-20 right-4 z-50 transition-transform duration-300 ease-in-out",
            isCollapsed ? "translate-x-[calc(100%+1rem)]" : "translate-x-0"
        )}>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className={toggleClass}>
                {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

             <GlassPanel className={cn("w-72 h-auto", darkMode ? "bg-black/60 border-white/5" : "bg-white/70")}>
                <div className="p-4 border-b border-white/5 font-bold text-sm text-neutral-300">Flux Field Controls</div>
                <div className="p-5 space-y-6">
                     <div className="space-y-2">
                        <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                            <span>Density</span>
                            <span className="opacity-50 font-mono">{fluxCount}</span>
                        </label>
                        <input type="range" min="100" max="5000" step="100" value={fluxCount} onChange={(e) => setFluxCount(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
                    </div>
                     <div className="space-y-2">
                        <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                            <span>Flow Speed</span>
                            <span className="opacity-50 font-mono">{fluxSpeed.toFixed(1)}</span>
                        </label>
                        <input type="range" min="0" max="2" step="0.1" value={fluxSpeed} onChange={(e) => setFluxSpeed(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
                    </div>
                     <div className="space-y-2">
                        <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                            <span>Particle Size</span>
                            <span className="opacity-50 font-mono">{fluxSize.toFixed(1)}</span>
                        </label>
                        <input type="range" min="0.5" max="5" step="0.1" value={fluxSize} onChange={(e) => setFluxSize(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
                    </div>
                    <div className="space-y-2">
                        <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                            <span>Turbulence</span>
                            {/* Round to integer to avoid long decimals or weird formatting */}
                            <span className="opacity-50 font-mono">{Math.round(fluxChaos)}</span>
                        </label>
                        <input type="range" min="0" max="100" value={fluxChaos} onChange={(e) => setFluxChaos(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
                    </div>
                    
                     <div className="space-y-2 border-t border-white/5 pt-4">
                        <label className={cn("text-xs font-medium", labelClass)}>Theme Colors</label>
                        <div className="flex gap-2">
                             <input type="color" value={gradientColors[0]} onChange={(e) => setGradientColor(0, e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                             <input type="color" value={gradientColors[1]} onChange={(e) => setGradientColor(1, e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" />
                        </div>
                    </div>
                </div>
             </GlassPanel>
        </div>
    );
}

export default function FluxPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { darkMode } = useMorphStore();

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(async () => {
      const canvas = document.querySelector("#flux-canvas-node canvas") as HTMLCanvasElement;
      if (canvas) {
          const dataUrl = canvas.toDataURL("image/png");
          download(dataUrl, "morph-flux.png");
          setIsExporting(false);
      }
    }, 100);
  };

  return (
    <main className={cn("relative h-screen w-full overflow-hidden", darkMode ? "bg-black" : "bg-white")}>
      <FluxCanvas />
      
      {!isExporting && (
        <>
          <ActionBar onDownload={handleDownload} />
          <FluxControls />
        </>
      )}
    </main>
  );
}