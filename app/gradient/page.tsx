import React, { useState } from "react";
import GradientCanvas from "../../components/canvas/GradientCanvas";
import { GlassPanel } from "../../components/ui/GlassPanel";
import GradientControls from "../../components/gradient/GradientControls";
import { useMorphStore } from "../../store/useMorphStore";
import { Home, Download, Shuffle, Sun, Moon } from "lucide-react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { cn } from "../../lib/utils";

export default function GradientPage() {
  const { 
    blurColors, noiseScale, 
    randomize, darkMode, setDarkMode 
  } = useMorphStore();
  
  const [isExporting, setIsExporting] = useState(false);

  // Navigation
  const handleHome = () => {
    window.dispatchEvent(new CustomEvent("morph-navigate", { detail: "/" }));
  };

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(async () => {
      const node = document.getElementById("gradient-capture-area");
      if (node) {
        try {
          const dataUrl = await toPng(node, { pixelRatio: 2 });
          download(dataUrl, "morph-blur-gradient.png");
        } catch (error) {
          console.error("Export failed", error);
        } finally {
          setIsExporting(false);
        }
      }
    }, 100);
  };

  // Styles
  const glassStyle = darkMode 
    ? "bg-neutral-900/50 border-white/5 shadow-2xl shadow-orange-900/5 hover:border-orange-500/30" 
    : "bg-white/70 border-slate-200/50 shadow-slate-200/40";
    
  const buttonClass = cn(
    "p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95",
    darkMode 
      ? "text-neutral-400 hover:text-orange-400 hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" 
      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
  );

  return (
    <main 
        id="gradient-capture-area" 
        className={cn(
            "relative w-full h-screen overflow-hidden bg-transparent" // REMOVED bg-black/bg-slate-50
        )}
    >
      
      {/* Background Tool (Fullscreen) */}
      <GradientCanvas colors={blurColors} noiseScale={noiseScale} />

      {!isExporting && (
        <>
          {/* Top Action Bar */}
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20">
             <GlassPanel className={cn("p-1.5 flex items-center gap-1 rounded-full", glassStyle)}>
                <button onClick={handleHome} className={buttonClass} title="Home">
                  <Home size={18} />
                </button>
                
                <div className="w-px h-4 mx-1 bg-white/10" />
                
                <button onClick={() => setDarkMode(!darkMode)} className={buttonClass} title="Toggle Theme">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className="w-px h-4 mx-1 bg-white/10" />

                <button onClick={randomize} className={cn(buttonClass, "group")} title="Randomize">
                  <Shuffle size={18} className="group-hover:animate-pulse" />
                </button>
                
                <div className="w-px h-4 mx-1 bg-white/10" />
                
                <button 
                    onClick={handleDownload} 
                    className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
                        darkMode 
                            ? "text-neutral-300 border-transparent hover:bg-white/5 hover:border-orange-500/20"
                            : "text-slate-700 border-transparent hover:bg-blue-50 hover:text-blue-600"
                    )}
                >
                  <Download size={16} />
                  Export
                </button>
             </GlassPanel>
          </div>

          {/* New Compact Sidebar */}
          <GradientControls />
        </>
      )}
    </main>
  );
}