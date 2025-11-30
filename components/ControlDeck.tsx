import React, { useState } from "react";
import { useMorphStore } from "../store/useMorphStore";
import { GlassPanel } from "./ui/GlassPanel";
import { Layers, Palette, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "../lib/utils";

export default function ControlDeck() {
  const [activeTab, setActiveTab] = useState<'shape' | 'style'>('shape');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const {
    chaos, setChaos,
    smoothness, setSmoothness,
    warp, setWarp,
    motionSpeed, setMotionSpeed,
    fillType, setFillType,
    gradientColors, setGradientColor,
    glowIntensity, setGlowIntensity,
    darkMode
  } = useMorphStore();

  // Dynamic Theme Classes
  const textPrimary = darkMode ? "text-neutral-200" : "text-slate-900";
  const textSecondary = darkMode ? "text-neutral-500" : "text-slate-400";
  const labelClass = darkMode ? "text-neutral-400" : "text-slate-600";
  const borderDivider = darkMode ? "border-white/5" : "border-slate-200";
  
  // Updated Glass Style: Black/60 background, Amber shadow
  const glassStyle = darkMode 
    ? "bg-black/60 border-white/5 shadow-2xl shadow-orange-900/10" 
    : "bg-white/70 border-slate-200/50 shadow-slate-200/40";
    
  // Updated Active Tab: Amber/Orange accents
  const activeTabStyle = darkMode 
    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]" 
    : "bg-white text-blue-600 shadow-sm border border-slate-100";
    
  const inactiveTabStyle = darkMode 
    ? "text-neutral-500 hover:text-neutral-300 hover:bg-white/5" 
    : "text-slate-400 hover:text-slate-600";

  return (
    <div className={cn(
      "fixed top-4 bottom-4 right-4 z-10 transition-transform duration-300 ease-in-out",
      isCollapsed ? "translate-x-[calc(100%+1rem)]" : "translate-x-0"
    )}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute left-0 top-1/2 -translate-x-[120%] -translate-y-1/2 p-2 backdrop-blur-md rounded-full transition-all border",
          darkMode 
            ? "bg-black/40 border-white/5 text-neutral-400 hover:text-orange-400 hover:bg-black/60 hover:border-orange-500/20"
            : "bg-white/70 border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-white"
        )}
      >
        {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* COMPACT WIDTH: w-72 instead of w-80 */}
      <GlassPanel className={cn("w-72 h-full flex flex-col overflow-hidden transition-colors duration-300", glassStyle)}>
        {/* Header - Reduced Padding */}
        <div className={cn("p-5 pb-3 border-b flex justify-between items-center", borderDivider)}>
          <div>
            <h2 className={cn("text-lg font-bold tracking-tight mb-0.5", textPrimary)}>Morph</h2>
            <p className={cn("text-[10px] uppercase tracking-widest font-semibold", darkMode ? "text-orange-500" : "text-blue-500")}>Generator</p>
          </div>
        </div>

        {/* Tabs - Reduced Padding */}
        <div className={cn("flex p-1.5 gap-1.5", darkMode ? "bg-black/20" : "bg-slate-100/50")}>
          <button
            onClick={() => setActiveTab('shape')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeTab === 'shape' ? activeTabStyle : inactiveTabStyle
            )}
          >
            <Layers size={14} /> Shape
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeTab === 'style' ? activeTabStyle : inactiveTabStyle
            )}
          >
            <Palette size={14} /> Style
          </button>
        </div>

        {/* Controls Area - Reduced Padding & Spacing */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* SHAPE CONTROLS */}
          {activeTab === 'shape' && (
            <>
              <div className="space-y-3">
                <LabelValue label="Chaos" value={chaos} darkMode={darkMode} />
                <RangeInput value={chaos} onChange={setChaos} darkMode={darkMode} />
                <p className={cn("text-[10px]", textSecondary)}>
                  Amplitude of distortion
                </p>
              </div>

              <div className="space-y-3">
                <LabelValue label="Smoothness" value={smoothness} darkMode={darkMode} />
                <RangeInput value={smoothness} onChange={setSmoothness} min={3} max={15} darkMode={darkMode} />
                <p className={cn("text-[10px]", textSecondary)}>
                  Vertex count
                </p>
              </div>

              <div className="space-y-3">
                <LabelValue label="Warp" value={warp} darkMode={darkMode} />
                <RangeInput value={warp} onChange={setWarp} darkMode={darkMode} />
                <p className={cn("text-[10px]", textSecondary)}>
                  Noise frequency
                </p>
              </div>

              <div className={cn("space-y-3 border-t pt-3", borderDivider)}>
                <LabelValue label="Motion Speed" value={motionSpeed} darkMode={darkMode} />
                <RangeInput value={motionSpeed} onChange={setMotionSpeed} darkMode={darkMode} />
              </div>
            </>
          )}

          {/* STYLE CONTROLS */}
          {activeTab === 'style' && (
            <>
              <div className="space-y-3">
                <label className={cn("font-medium text-xs", labelClass)}>Fill Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['solid', 'linear', 'radial'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFillType(type as any)}
                      className={cn(
                        "px-1 py-1.5 rounded text-[10px] border transition-all capitalize font-medium",
                        fillType === type 
                          ? (darkMode ? "bg-orange-500 border-orange-500 text-white" : "bg-blue-600 border-blue-600 text-white")
                          : cn("border-transparent", darkMode ? "bg-white/5 text-neutral-400 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200")
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className={cn("space-y-3 pt-3 border-t", borderDivider)}>
                <label className={cn("font-medium text-xs", labelClass)}>Colors</label>
                <div className="flex gap-3">
                  <ColorPicker 
                    color={gradientColors[0]} 
                    onChange={(c) => setGradientColor(0, c)} 
                    label="Start"
                    darkMode={darkMode}
                  />
                  {fillType !== 'solid' && (
                    <ColorPicker 
                      color={gradientColors[1]} 
                      onChange={(c) => setGradientColor(1, c)} 
                      label="End"
                      darkMode={darkMode}
                    />
                  )}
                </div>
              </div>

              <div className={cn("space-y-3 pt-3 border-t", borderDivider)}>
                <LabelValue label="Glow Intensity" value={glowIntensity} darkMode={darkMode} />
                <RangeInput value={glowIntensity} onChange={setGlowIntensity} darkMode={darkMode} />
              </div>
            </>
          )}

        </div>
        
        <div className={cn("p-3 text-[10px] text-center border-t", borderDivider, darkMode ? "bg-black/40 text-neutral-600" : "bg-slate-50 text-slate-400")}>
          v1.5 Deep Ember
        </div>
      </GlassPanel>
    </div>
  );
}

// Subcomponents
const LabelValue = ({ label, value, darkMode }: { label: string, value: number, darkMode: boolean }) => (
  <div className="flex justify-between text-xs items-center">
    <label className={cn("font-medium", darkMode ? "text-neutral-400" : "text-slate-600")}>{label}</label>
    <span className={cn("font-mono text-[10px] px-1.5 py-0.5 rounded border", darkMode ? "text-neutral-400 bg-white/5 border-white/5" : "text-slate-500 bg-slate-100 border-slate-200")}>{value}</span>
  </div>
);

const RangeInput = ({ value, onChange, min=0, max=100, darkMode }: { value: number, onChange: (v: number) => void, min?: number, max?: number, darkMode: boolean }) => (
  <input
    type="range"
    min={min}
    max={max}
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className={cn(
      "w-full h-1 rounded-lg appearance-none cursor-pointer outline-none",
      // Orange accent for dark mode, Blue for light mode
      darkMode ? "bg-white/10 accent-orange-500 hover:accent-orange-400" : "bg-slate-200 accent-blue-600 hover:accent-blue-500"
    )}
  />
);

const ColorPicker = ({ color, onChange, label, darkMode }: { color: string, onChange: (c: string) => void, label: string, darkMode: boolean }) => (
  <div className="flex-1 space-y-1.5">
    <span className={cn("text-[9px] uppercase tracking-wider", darkMode ? "text-neutral-500" : "text-slate-400")}>{label}</span>
    <div className={cn("relative h-8 w-full rounded-md overflow-hidden ring-1 group", darkMode ? "ring-white/10" : "ring-slate-200")}>
      <div className="absolute inset-0" style={{ backgroundColor: color }} />
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-0 cursor-pointer"
      />
    </div>
    <div className={cn("text-[9px] font-mono text-center", darkMode ? "text-white/30" : "text-slate-400")}>{color}</div>
  </div>
);