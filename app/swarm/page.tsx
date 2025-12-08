import React, { useState } from "react";
import SwarmCanvas from "../../components/canvas/SwarmCanvas";
import ActionBar from "../../components/ActionBar";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useMorphStore } from "../../store/useMorphStore";
import { cn } from "../../lib/utils";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { Settings, Palette } from "lucide-react";

const SwarmControls = () => {
  const [activeTab, setActiveTab] = useState<"behavior" | "style">("behavior");

  const {
    swarmCount,
    setSwarmCount,
    swarmSpeed,
    setSwarmSpeed,
    swarmCohesion,
    setSwarmCohesion,
    swarmSeparation,
    setSwarmSeparation,
    swarmTrailLength,
    setSwarmTrailLength,
    swarmSize,
    setSwarmSize,
    gradientColors,
    setGradientColor,
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
          onClick={() => setActiveTab("behavior")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all",
            activeTab === "behavior" ? activeTabStyle : inactiveTabStyle
          )}
        >
          <Settings size={14} /> Behavior
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all",
            activeTab === "style" ? activeTabStyle : inactiveTabStyle
          )}
        >
          <Palette size={14} /> Style
        </button>
      </div>

      <div className="p-5 pt-2 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
        {activeTab === "behavior" && (
          <>
            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Particle Count</span>
                <span className="opacity-50 font-mono">{swarmCount}</span>
              </label>
              <input
                type="range"
                min="50"
                max="1000"
                value={swarmCount}
                onChange={(e) => setSwarmCount(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Movement Speed</span>
                <span className="opacity-50 font-mono">{swarmSpeed.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={swarmSpeed}
                onChange={(e) => setSwarmSpeed(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Cohesion (Attraction)</span>
                <span className="opacity-50 font-mono">{swarmCohesion}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={swarmCohesion}
                onChange={(e) => setSwarmCohesion(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Separation (Avoidance)</span>
                <span className="opacity-50 font-mono">{swarmSeparation}</span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={swarmSeparation}
                onChange={(e) => setSwarmSeparation(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>
          </>
        )}

        {activeTab === "style" && (
          <>
            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Trail Length</span>
                <span className="opacity-50 font-mono">{swarmTrailLength}</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={swarmTrailLength}
                onChange={(e) => setSwarmTrailLength(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Particle Size</span>
                <span className="opacity-50 font-mono">{swarmSize.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={swarmSize}
                onChange={(e) => setSwarmSize(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-4 border-t pt-4 border-white/5">
              <label className={cn("text-xs font-medium", labelClass)}>Color Gradient</label>
              <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="space-y-1">
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider",
                      darkMode ? "text-neutral-500" : "text-slate-400"
                    )}
                  >
                    Start Color
                  </span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={gradientColors[0]}
                      onChange={(e) => setGradientColor(0, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                    />
                    <span className={cn("text-xs font-mono", darkMode ? "text-neutral-400" : "text-slate-500")}>
                      {gradientColors[0]}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-1">
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider",
                      darkMode ? "text-neutral-500" : "text-slate-400"
                    )}
                  >
                    End Color
                  </span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={gradientColors[1]}
                      onChange={(e) => setGradientColor(1, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                    />
                    <span className={cn("text-xs font-mono", darkMode ? "text-neutral-400" : "text-slate-500")}>
                      {gradientColors[1]}
                    </span>
                  </div>
                </div>
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

export default function SwarmPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { darkMode } = useMorphStore();

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(async () => {
      const node = document.getElementById("swarm-capture-area");
      if (node) {
        const dataUrl = await toPng(node, {
          pixelRatio: 2,
          backgroundColor: darkMode ? "#000" : "#fff",
        });
        download(dataUrl, "morph-swarm.png");
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <main
      id="swarm-capture-area"
      className={cn("relative h-screen w-full overflow-hidden", darkMode ? "bg-black" : "bg-white")}
    >
      <SwarmCanvas />

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
                Particle Swarm Controls
              </div>
              <SwarmControls />
            </GlassPanel>
          </div>
        </>
      )}
    </main>
  );
}
