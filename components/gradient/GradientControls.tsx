import React, { useState } from 'react';
import { GlassPanel } from "../ui/GlassPanel";
import { useMorphStore } from "../../store/useMorphStore";
import { ChevronLeft, ChevronRight, Palette, Layers } from "lucide-react";
import { cn } from "../../lib/utils";

export default function GradientControls() {
    const { 
        blurColors, setBlurColor, 
        noiseScale, setNoiseScale, 
        darkMode 
    } = useMorphStore();
    
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Dynamic Styles
    const glassStyle = darkMode 
        ? "bg-black/60 border-white/5 shadow-2xl shadow-orange-900/10" 
        : "bg-white/70 border-slate-200/50 shadow-slate-200/40";
        
    const textPrimary = darkMode ? "text-neutral-200" : "text-slate-900";
    const labelClass = darkMode ? "text-neutral-400" : "text-slate-600";

    return (
        <div className={cn(
            "fixed bottom-4 right-4 z-10 transition-transform duration-300 ease-in-out flex flex-col items-end",
            isCollapsed ? "translate-x-[calc(100%+1rem)]" : "translate-x-0"
        )}>
            
            {/* Toggle Handle */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                    "absolute left-0 top-1/2 -translate-x-[120%] -translate-y-1/2 p-2 backdrop-blur-md rounded-full border transition-colors",
                    darkMode 
                        ? "bg-black/40 border-white/5 text-neutral-400 hover:text-orange-400"
                        : "bg-white/70 border-slate-200 text-slate-400 hover:text-blue-600"
                )}
            >
                {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            {/* Compact Panel */}
            <GlassPanel className={cn("w-72 p-5 flex flex-col gap-5", glassStyle)}>
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className={cn("font-bold text-sm tracking-tight", textPrimary)}>Gradient Flow</h3>
                    <Palette size={14} className={darkMode ? "text-orange-500" : "text-blue-500"} />
                </div>

                {/* Color Row (Compact) */}
                <div className="space-y-2">
                    <label className={cn("text-[10px] uppercase tracking-wider font-semibold", labelClass)}>Palette</label>
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                        {blurColors.map((color, idx) => (
                            <div key={idx} className="relative group">
                                <div 
                                    className="w-8 h-8 rounded-full shadow-lg ring-2 ring-white/10 transition-transform transform group-hover:scale-110 group-hover:ring-orange-500/50 cursor-pointer overflow-hidden"
                                    style={{ backgroundColor: color }}
                                >
                                    <input 
                                        type="color" 
                                        value={color}
                                        onChange={(e) => setBlurColor(idx, e.target.value)}
                                        className="absolute inset-0 w-[200%] h-[200%] opacity-0 cursor-pointer -top-1/2 -left-1/2"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <label className={cn("font-medium", labelClass)}>Cloudiness</label>
                        <span className={cn("font-mono opacity-50", textPrimary)}>{noiseScale.toFixed(1)}</span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={noiseScale}
                        onChange={(e) => setNoiseScale(Number(e.target.value))}
                        className={cn(
                            "w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none",
                            darkMode ? "bg-white/10 accent-orange-500" : "bg-slate-200 accent-blue-600"
                        )}
                    />
                </div>

            </GlassPanel>
        </div>
    );
}
