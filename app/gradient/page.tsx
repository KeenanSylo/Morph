import React, { useState, useRef, useEffect } from "react";
import GradientCanvas from "../../components/canvas/GradientCanvas";
import { GlassPanel } from "../../components/ui/GlassPanel";
import GradientControls from "../../components/gradient/GradientControls";
import { useMorphStore } from "../../store/useMorphStore";
import { Home, ChevronDown, Shuffle, Sun, Moon, Image as ImageIcon, Code, Video, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { getGradientCode } from "../../lib/generateCode";
import { cn } from "../../lib/utils";

export default function GradientPage() {
  const { 
    blurColors, noiseScale, gradientSpeed, loopDuration, isPaused,
    randomize, darkMode, setDarkMode 
  } = useMorphStore();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation
  const handleHome = () => {
    window.dispatchEvent(new CustomEvent("morph-navigate", { detail: "/" }));
  };

  const handleDownloadPNG = () => {
    setIsExporting(true);
    setIsMenuOpen(false);
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

  const handleDownloadVideo = () => {
    setIsMenuOpen(false);
    const canvas = document.querySelector("#gradient-canvas-node canvas") as HTMLCanvasElement;
    if (!canvas) {
        alert("Canvas not found");
        return;
    }

    setIsRecording(true);

    try {
        const stream = canvas.captureStream(30); // 30 FPS
        const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm;codecs=vp9"
        });

        const chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            download(blob, `morph-loop-${loopDuration}s.webm`, "video/webm");
            setIsRecording(false);
        };

        recorder.start();

        // Record for exact loop duration + small buffer (handled by recorder stop)
        setTimeout(() => {
            recorder.stop();
        }, loopDuration * 1000);

    } catch (e) {
        console.error("MediaRecorder error:", e);
        alert("Video export is not supported in this browser environment.");
        setIsRecording(false);
    }
  };

  const handleCopyCode = () => {
    const code = getGradientCode({
        colors: blurColors,
        noiseScale: noiseScale
    });
    navigator.clipboard.writeText(code);
    alert("React Three Fiber component copied to clipboard!");
    setIsMenuOpen(false);
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
  
  const dividerClass = cn(
    "w-px h-4 mx-1",
    darkMode ? "bg-white/10" : "bg-slate-200"
  );

  return (
    <main 
        id="gradient-capture-area" 
        className={cn(
            "relative w-full h-screen overflow-hidden bg-transparent"
        )}
    >
      
      {/* Background Tool (Fullscreen) */}
      <GradientCanvas 
        colors={blurColors} 
        noiseScale={noiseScale} 
        gradientSpeed={gradientSpeed}
        loopDuration={loopDuration}
        isPaused={isPaused}
      />

      {/* Recording Overlay */}
      {isRecording && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="flex flex-col items-center gap-4 text-white">
                <Loader2 size={48} className="animate-spin text-orange-500" />
                <div className="text-xl font-bold tracking-tight">Recording Loop...</div>
                <p className="text-neutral-400 text-sm">Capturing {loopDuration} seconds for seamless loop</p>
            </div>
        </div>
      )}

      {!isExporting && !isRecording && (
        <>
          {/* Top Action Bar */}
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20" ref={menuRef}>
             <GlassPanel className={cn("p-1.5 flex items-center gap-1 rounded-full", glassStyle)}>
                <button onClick={handleHome} className={buttonClass} title="Home">
                  <Home size={18} />
                </button>
                
                <div className={dividerClass} />
                
                <button onClick={() => setDarkMode(!darkMode)} className={buttonClass} title="Toggle Theme">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <div className={dividerClass} />

                <button onClick={randomize} className={cn(buttonClass, "group")} title="Randomize">
                  <Shuffle size={18} className="group-hover:animate-pulse" />
                </button>
                
                <div className={dividerClass} />
                
                {/* Export Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200 font-medium text-sm",
                        darkMode 
                            ? (isMenuOpen ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "hover:bg-white/5 text-neutral-300 border border-transparent")
                            : (isMenuOpen ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700")
                        )}
                    >
                        Export
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className={cn(
                        "absolute top-full right-0 mt-2 w-48 py-1 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right border",
                        darkMode
                            ? "bg-black/90 border-white/10 shadow-orange-900/20"
                            : "bg-white border-slate-200"
                        )}>
                        
                        <button onClick={handleDownloadPNG} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors", darkMode ? "text-neutral-400 hover:bg-white/5 hover:text-orange-400" : "text-slate-700 hover:bg-slate-50")}>
                            <ImageIcon size={16} />
                            <span>Download PNG</span>
                        </button>

                        <button onClick={handleDownloadVideo} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t", darkMode ? "text-neutral-400 hover:bg-white/5 hover:text-orange-400 border-white/5" : "text-slate-700 hover:bg-slate-50 border-slate-100")}>
                            <Video size={16} />
                            <span>Download Loop ({loopDuration}s)</span>
                        </button>
                        
                        <button onClick={handleCopyCode} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t", darkMode ? "text-neutral-400 hover:bg-white/5 hover:text-orange-400 border-white/5" : "text-slate-700 hover:bg-slate-50 border-slate-100")}>
                            <Code size={16} />
                            <span>Copy React Code</span>
                        </button>

                        </div>
                    )}
                </div>

             </GlassPanel>
          </div>

          {/* Sidebar */}
          <GradientControls />
        </>
      )}
    </main>
  );
}