import React, { useState, useRef, useEffect } from "react";
import { Shuffle, Download, Image as ImageIcon, FileCode, Code, ChevronDown, Home, Play, Pause, Sun, Moon } from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";
import { useMorphStore } from "../store/useMorphStore";
import download from "downloadjs";
import { getReactComponent } from "../lib/generateCode";
import { cn } from "../lib/utils";

interface ActionBarProps {
  onDownload?: () => void;
}

export default function ActionBar({ onDownload }: ActionBarProps) {
  const { randomize, isPaused, setIsPaused, darkMode, setDarkMode } = useMorphStore();
  const store = useMorphStore();
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

  const handleHome = () => {
    window.dispatchEvent(new CustomEvent("morph-navigate", { detail: "/" }));
  };

  const handleExportPNG = () => {
    const svgElement = document.getElementById("morph-svg-target");
    if (!svgElement) return;

    // Serialize SVG to string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgElement);

    // Create a Canvas to render the SVG
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 1024;
    const height = 1024;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    // Encode SVG string to base64
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      if (ctx) {
        ctx.clearRect(0, 0, width, height); // Ensure transparency
        ctx.drawImage(img, 0, 0, width, height);
        const pngDataUrl = canvas.toDataURL("image/png");
        download(pngDataUrl, "morph-blob.png");
        URL.revokeObjectURL(url);
      }
      setIsMenuOpen(false);
    };

    img.src = url;
  };

  const handleExportSVG = () => {
    const svgElement = document.getElementById("morph-svg-target");
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    download(svgString, "morph-blob.svg", "image/svg+xml");
    setIsMenuOpen(false);
  };

  const handleCopyCode = () => {
    const pathElement = document.querySelector("#morph-svg-target path");
    const d = pathElement?.getAttribute("d");

    if (d) {
      const code = getReactComponent({
        pathD: d,
        fillType: store.fillType,
        colors: store.gradientColors,
        glowIntensity: store.glowIntensity
      });
      navigator.clipboard.writeText(code);
      alert("React Component copied to clipboard!");
    }
    setIsMenuOpen(false);
  };

  // Dynamic Styles based on Theme
  const buttonClass = cn(
    "p-3 rounded-full transition-all duration-300 hover:scale-105 active:scale-95",
    darkMode 
      // Deep Ember: Neutral icon, Orange glow on hover
      ? "text-neutral-400 hover:text-orange-400 hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" 
      : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
  );
  
  const dividerClass = cn(
    "w-px h-4 mx-1",
    darkMode ? "bg-white/5" : "bg-slate-200"
  );

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20" ref={menuRef}>
      <GlassPanel className={cn(
        "p-1.5 flex items-center gap-1 rounded-full shadow-xl transition-all duration-300",
        darkMode 
          // Deep Ember: Neutral dark glass, subtle border, warm hover border
          ? "bg-neutral-900/50 border-white/5 shadow-2xl shadow-orange-900/5 hover:border-orange-500/30" 
          : "bg-white/70 border-slate-200/50"
      )}>
        
        {/* Home Button */}
        <button onClick={handleHome} className={buttonClass} title="Back to Home">
          <Home size={18} />
        </button>

        <div className={dividerClass} />

        {/* Theme Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className={buttonClass} 
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={dividerClass} />

        {/* Play/Pause Button */}
        <button onClick={() => setIsPaused(!isPaused)} className={buttonClass}>
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
        </button>

        <div className={dividerClass} />
        
        {/* Shuffle Button */}
        <button onClick={randomize} className={cn(buttonClass, "group")}>
          <Shuffle size={18} className="group-hover:animate-pulse" />
        </button>
        
        <div className={dividerClass} />
        
        {/* Export Dropdown Trigger */}
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
              
              <button onClick={handleExportPNG} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors", darkMode ? "text-neutral-400 hover:bg-white/5 hover:text-orange-400" : "text-slate-700 hover:bg-slate-50")}>
                <ImageIcon size={16} />
                <span>Download PNG</span>
              </button>
              
              <button onClick={handleExportSVG} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-t", darkMode ? "text-neutral-400 hover:bg-white/5 hover:text-orange-400 border-white/5" : "text-slate-700 hover:bg-slate-50 border-slate-100")}>
                <FileCode size={16} />
                <span>Download SVG</span>
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
  );
}