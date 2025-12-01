import React, { useState } from "react";
import WaveCanvas from "../../components/canvas/WaveCanvas";
import ControlDeck from "../../components/ControlDeck";
import ActionBar from "../../components/ActionBar";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useMorphStore } from "../../store/useMorphStore";
import { cn } from "../../lib/utils";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { useShallow } from 'zustand/react/shallow';

// Custom Controls for Waves (Inline for speed, usually would be separate file)
const WaveControls = () => {
    const { 
        waveLayers, setWaveLayers,
        waveHeight, setWaveHeight,
        waveFrequency, setWaveFrequency,
        motionSpeed, setMotionSpeed,
        gradientColors, setGradientColor,
        darkMode
    } = useMorphStore();

    const labelClass = darkMode ? "text-neutral-400" : "text-slate-600";
    const accentClass = darkMode ? "bg-white/10 accent-orange-500" : "bg-slate-200 accent-blue-600";

    return (
        <div className="p-5 space-y-6">
             <div className="space-y-2">
                <label className={cn("text-xs font-medium", labelClass)}>Stack Count</label>
                <input type="range" min="2" max="8" value={waveLayers} onChange={(e) => setWaveLayers(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
            </div>
             <div className="space-y-2">
                <label className={cn("text-xs font-medium", labelClass)}>Wave Height</label>
                {/* Constrained max height to avoid overlapping chaos */}
                <input type="range" min="10" max="60" value={waveHeight} onChange={(e) => setWaveHeight(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
            </div>
             <div className="space-y-2">
                <label className={cn("text-xs font-medium", labelClass)}>Frequency</label>
                {/* Constrained max frequency to prevent spikes */}
                <input type="range" min="5" max="30" value={waveFrequency} onChange={(e) => setWaveFrequency(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
            </div>
             <div className="space-y-2">
                <label className={cn("text-xs font-medium", labelClass)}>Flow Speed</label>
                <input type="range" min="0" max="20" value={motionSpeed} onChange={(e) => setMotionSpeed(Number(e.target.value))} className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)} />
            </div>
            
             <div className="space-y-2 border-t border-white/5 pt-4">
                <label className={cn("text-xs font-medium", labelClass)}>Theme</label>
                <div className="flex gap-2">
                     <input type="color" value={gradientColors[0]} onChange={(e) => setGradientColor(0, e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                     <input type="color" value={gradientColors[1]} onChange={(e) => setGradientColor(1, e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                </div>
            </div>
        </div>
    );
}

export default function WavePage() {
  const [isExporting, setIsExporting] = useState(false);
  const { darkMode } = useMorphStore();

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(async () => {
      const node = document.getElementById("wave-capture-area");
      if (node) {
          const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: darkMode ? '#000' : '#fff' });
          download(dataUrl, "morph-waves.png");
          setIsExporting(false);
      }
    }, 100);
  };

  return (
    <main id="wave-capture-area" className={cn("relative h-screen w-full overflow-hidden", darkMode ? "bg-black" : "bg-white")}>
      <WaveCanvas interactive={true} />
      
      {!isExporting && (
        <>
          <ActionBar onDownload={handleDownload} />
          {/* Custom Sidebar for Waves */}
          <div className="fixed top-20 right-4 w-72">
             <GlassPanel className={cn("h-auto", darkMode ? "bg-black/60 border-white/5" : "bg-white/70")}>
                <div className="p-4 border-b border-white/5 font-bold text-sm text-neutral-300">Wave Controls</div>
                <WaveControls />
             </GlassPanel>
          </div>
        </>
      )}
    </main>
  );
}