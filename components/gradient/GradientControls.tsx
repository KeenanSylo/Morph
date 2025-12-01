import React, { useState } from 'react';
import { GlassPanel } from "../ui/GlassPanel";
import { useMorphStore } from "../../store/useMorphStore";
import { ChevronLeft, ChevronRight, Palette, Play, Pause, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

export default function GradientControls() {
    const { 
        blurColors, setBlurColor, 
        noiseScale, setNoiseScale, 
        gradientSpeed, setGradientSpeed,
        loopDuration, setLoopDuration,
        isPaused, setIsPaused,
        darkMode 
    } = useMorphStore();
    
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Dynamic Styles
    const glassStyle = darkMode 
        ? "bg-black/60 border-white/5 shadow-2xl shadow-orange-900/10" 
        : "bg-white/70 border-slate-200/50 shadow-slate-200/40";
        
    const textPrimary = darkMode ? "text-neutral-200" : "text-slate-900";
    const labelClass = darkMode ? "text-neutral-400" : "text-slate-600";
    const accentClass = darkMode ? "bg-white/10 accent-orange-500" : "bg-slate-200 accent-blue-600";

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
                    
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={() => setIsPaused(!isPaused)}
                            className={cn(
                                "p-1 rounded transition-colors", 
                                darkMode ? "hover:text-orange-400 text-neutral-500" : "hover:text-blue-600 text-slate-400"
                            )}
                            title={isPaused ? "Play" : "Pause"}
                         >
                            {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                         </button>
                        <Palette size={14} className={darkMode ? "text-orange-500" : "text-blue-500"} />
                    </div>
                </div>

                {/* Color Row */}
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

                {/* Sliders */}
                <div className="space-y-4">
                    
                    {/* Loop Duration Selector */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs items-center">
                            <label className={cn("font-medium flex items-center gap-1.5", labelClass)}>
                                <Clock size={12} /> Loop Duration
                            </label>
                            <span className={cn("font-mono opacity-50", textPrimary)}>{loopDuration}s</span>
                        </div>
                        <div className="flex gap-1.5">
                            {[5, 10, 20].map(duration => (
                                <button
                                    key={duration}
                                    onClick={() => setLoopDuration(duration)}
                                    className={cn(
                                        "flex-1 py-1.5 text-[10px] font-medium rounded transition-all border",
                                        loopDuration === duration
                                            ? (darkMode ? "bg-orange-500 border-orange-500 text-white" : "bg-blue-600 border-blue-600 text-white")
                                            : (darkMode ? "bg-white/5 border-transparent text-neutral-400 hover:bg-white/10" : "bg-slate-100 border-transparent text-slate-500 hover:bg-slate-200")
                                    )}
                                >
                                    {duration}s
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scale (Blur) */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <label className={cn("font-medium", labelClass)}>Blur Softness</label>
                            <span className={cn("font-mono opacity-50", textPrimary)}>{noiseScale.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.1"
                            value={noiseScale}
                            onChange={(e) => setNoiseScale(Number(e.target.value))}
                            className={cn(
                                "w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none",
                                accentClass
                            )}
                        />
                    </div>
                    
                    {/* Speed (Amplitude) */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <label className={cn("font-medium", labelClass)}>Motion Amplitude</label>
                            <span className={cn("font-mono opacity-50", textPrimary)}>{gradientSpeed.toFixed(1)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.2"
                            max="2.0"
                            step="0.1"
                            value={gradientSpeed}
                            onChange={(e) => setGradientSpeed(Number(e.target.value))}
                            className={cn(
                                "w-full h-1.5 rounded-lg appearance-none cursor-pointer outline-none",
                                accentClass
                            )}
                        />
                    </div>

                </div>

            </GlassPanel>
        </div>
    );
}