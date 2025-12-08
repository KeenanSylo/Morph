import React, { useState } from "react";
import MeshMorphCanvas from "../../components/canvas/MeshMorphCanvas";
import ActionBar from "../../components/ActionBar";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { useMorphStore } from "../../store/useMorphStore";
import { cn } from "../../lib/utils";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { Settings, Palette } from "lucide-react";

const MeshControls = () => {
  const [activeTab, setActiveTab] = useState<"morph" | "style">("morph");

  const {
    meshComplexity,
    setMeshComplexity,
    morphIntensity,
    setMorphIntensity,
    morphSpeed,
    setMorphSpeed,
    morphWaveCount,
    setMorphWaveCount,
    meshWireframe,
    setMeshWireframe,
    meshMetalness,
    setMeshMetalness,
    meshRoughness,
    setMeshRoughness,
    meshColors,
    setMeshColor,
    meshColorCount,
    setMeshColorCount,
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
          onClick={() => setActiveTab("morph")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all",
            activeTab === "morph" ? activeTabStyle : inactiveTabStyle
          )}
        >
          <Settings size={14} /> Morph
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
        {activeTab === "morph" && (
          <>
            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Mesh Complexity</span>
                <span className="opacity-50 font-mono">{meshComplexity}</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={meshComplexity}
                onChange={(e) => setMeshComplexity(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Morph Intensity</span>
                <span className="opacity-50 font-mono">{morphIntensity}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={morphIntensity}
                onChange={(e) => setMorphIntensity(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Animation Speed</span>
                <span className="opacity-50 font-mono">{morphSpeed.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={morphSpeed}
                onChange={(e) => setMorphSpeed(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Wave Patterns</span>
                <span className="opacity-50 font-mono">{morphWaveCount}</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={morphWaveCount}
                onChange={(e) => setMorphWaveCount(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>
          </>
        )}

        {activeTab === "style" && (
          <>
            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between items-center", labelClass)}>
                <span>Wireframe Mode</span>
                <input
                  type="checkbox"
                  checked={meshWireframe}
                  onChange={(e) => setMeshWireframe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </label>
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Metalness</span>
                <span className="opacity-50 font-mono">{meshMetalness}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={meshMetalness}
                onChange={(e) => setMeshMetalness(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
            </div>

            <div className="space-y-2">
              <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                <span>Roughness (Glossiness)</span>
                <span className="opacity-50 font-mono">{meshRoughness}</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={meshRoughness}
                onChange={(e) => setMeshRoughness(Number(e.target.value))}
                className={cn("w-full h-1.5 rounded-lg appearance-none cursor-pointer", accentClass)}
              />
              <p className={cn("text-[10px] italic", darkMode ? "text-neutral-600" : "text-slate-400")}>
                Lower = More glossy
              </p>
            </div>

            <div className="space-y-4 border-t pt-4 border-white/5">
              <label className={cn("text-xs font-medium", labelClass)}>Material Colors</label>
              
              <div className="space-y-2 mb-3">
                <label className={cn("text-xs font-medium flex justify-between", labelClass)}>
                  <span>Active Colors</span>
                  <span className="opacity-50 font-mono">{meshColorCount}</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMeshColorCount(num)}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                        meshColorCount === num
                          ? darkMode
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                            : "bg-blue-500/20 text-blue-600 border border-blue-500/40"
                          : darkMode
                          ? "bg-white/5 text-neutral-500 hover:bg-white/10 border border-white/10"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200"
                      )}
                    >
                      {num} Color{num > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/5">
                {meshColorCount >= 1 && (
                <div className="space-y-1">
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider",
                      darkMode ? "text-neutral-500" : "text-slate-400"
                    )}
                  >
                    Color 1
                  </span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={meshColors[0]}
                      onChange={(e) => setMeshColor(0, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                    />
                    <span className={cn("text-xs font-mono", darkMode ? "text-neutral-400" : "text-slate-500")}>
                      {meshColors[0]}
                    </span>
                  </div>
                </div>
                )}
                {meshColorCount >= 2 && <div className="h-px bg-white/10" />}
                {meshColorCount >= 2 && (
                <div className="space-y-1">
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider",
                      darkMode ? "text-neutral-500" : "text-slate-400"
                    )}
                  >
                    Color 2
                  </span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={meshColors[1]}
                      onChange={(e) => setMeshColor(1, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                    />
                    <span className={cn("text-xs font-mono", darkMode ? "text-neutral-400" : "text-slate-500")}>
                      {meshColors[1]}
                    </span>
                  </div>
                </div>
                )}
                {meshColorCount >= 3 && <div className="h-px bg-white/10" />}
                {meshColorCount >= 3 && (
                <div className="space-y-1">
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider",
                      darkMode ? "text-neutral-500" : "text-slate-400"
                    )}
                  >
                    Color 3
                  </span>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={meshColors[2]}
                      onChange={(e) => setMeshColor(2, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                    />
                    <span className={cn("text-xs font-mono", darkMode ? "text-neutral-400" : "text-slate-500")}>
                      {meshColors[2]}
                    </span>
                  </div>
                </div>
                )}
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

export default function MeshMorphPage() {
  const [isExporting, setIsExporting] = useState(false);
  const { darkMode } = useMorphStore();

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(async () => {
      const canvas = document.getElementById("mesh-canvas") as HTMLCanvasElement;
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        download(dataUrl, "morph-mesh.png");
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <main
      id="mesh-capture-area"
      className={cn("relative h-screen w-full overflow-hidden", darkMode ? "bg-black" : "bg-white")}
    >
      <MeshMorphCanvas />

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
                Mesh Morph Controls
              </div>
              <MeshControls />
            </GlassPanel>
          </div>
        </>
      )}
    </main>
  );
}
