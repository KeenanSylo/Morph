import React, { useState } from "react";
import CurveGradientCanvas from "../../components/canvas/CurveGradientCanvas";
import ActionBar from "../../components/ActionBar";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useMorphStore } from "../../store/useMorphStore";
import { cn } from "../../lib/utils";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { Settings, Palette } from "lucide-react";

const CurveControls = () => {
  const [activeTab, setActiveTab] = useState<"animation" | "colors">("animation");

  const {
    curveSpeed,
    setCurveSpeed,
    curveScale,
    setCurveScale,
    curveDensity,
    setCurveDensity,
    curveExpand,
    setCurveExpand,
    curveNoise,
    setCurveNoise,
    curveColors,
    setCurveColor,
    darkMode,
  } = useMorphStore();

  const labelClass = darkMode ? "text-neutral-400" : "text-slate-600";
  const accentClass = darkMode
    ? "bg-white/10 accent-orange-500"
    : "bg-slate-200 accent-blue-600";
  const activeTabStyle = darkMode
    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
    : "bg-white text-blue-600 shadow-sm border border-slate-100";
  const inactiveTabStyle = darkMode
    ? "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
    : "text-slate-400 hover:text-slate-600";

  return (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "flex p-1.5 gap-1.5 border-b mb-2",
          darkMode ? "bg-black/20 border-white/5" : "bg-slate-100/50 border-slate-200"
        )}
      >
        <button
          onClick={() => setActiveTab("animation")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all",
            activeTab === "animation" ? activeTabStyle : inactiveTabStyle
          )}
        >
          <Settings size={14} /> Animation
        </button>
        <button
          onClick={() => setActiveTab("colors")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all",
            activeTab === "colors" ? activeTabStyle : inactiveTabStyle
          )}
        >
          <Palette size={14} /> Colors
        </button>
      </div>

      <div className="p-5 pt-2 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
        {activeTab === "animation" && (
          <>
            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Animation Speed</span>
                <span className="opacity-50 font-mono">{curveSpeed.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={curveSpeed}
                onChange={(e) => setCurveSpeed(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Pattern Scale</span>
                <span className="opacity-50 font-mono">{curveScale.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={curveScale}
                onChange={(e) => setCurveScale(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Color Density</span>
                <span className="opacity-50 font-mono">{curveDensity.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={curveDensity}
                onChange={(e) => setCurveDensity(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Curve Expansion</span>
                <span className="opacity-50 font-mono">{curveExpand.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="2"
                max="15"
                step="0.5"
                value={curveExpand}
                onChange={(e) => setCurveExpand(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Film Grain Noise</span>
                <span className="opacity-50 font-mono">{curveNoise.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.01"
                value={curveNoise}
                onChange={(e) => setCurveNoise(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>
          </>
        )}

        {activeTab === "colors" && (
          <>
            <div className="space-y-4">
              <label className={cn("text-xs font-medium", labelClass)}>Gradient Colors</label>
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="space-y-1">
                      <span
                        className={cn(
                          "text-[10px] uppercase tracking-wider",
                          darkMode ? "text-neutral-500" : "text-slate-400"
                        )}
                      >
                        Color {index + 1}
                      </span>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={curveColors[index]}
                          onChange={(e) => setCurveColor(index, e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                        />
                        <span className={cn("text-xs font-mono", darkMode ? "text-neutral-400" : "text-slate-500")}>
                          {curveColors[index]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default function CurveGradientPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { darkMode } = useMorphStore();

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(async () => {
      const captureArea = document.getElementById("curve-gradient-capture");
      if (captureArea) {
        const dataUrl = await toPng(captureArea, { pixelRatio: 2 });
        download(dataUrl, "morph-curve-gradient.png");
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <main
      className={cn("relative h-screen w-full overflow-hidden", darkMode ? "bg-black" : "bg-white")}
    >
      <CurveGradientCanvas />

      {!isExporting && (
        <>
          <ActionBar onDownload={handleDownload} />
          <div className="fixed top-24 right-4 w-72 z-50">
            <GlassPanel
              className={cn(
                "h-auto overflow-hidden",
                darkMode ? "bg-black/60 border-white/5" : "bg-white/70"
              )}
            >
              <div className="p-4 py-3 border-b border-white/5 font-bold text-sm text-neutral-300">
                Curve Gradient Controls
              </div>
              <CurveControls />
            </GlassPanel>
          </div>
        </>
      )}
    </main>
  );
}
