import React from "react";
import { Shuffle, Download } from "lucide-react";
import { GlassPanel } from "./ui/GlassPanel";
import { useMorphStore } from "../store/useMorphStore";

export default function ActionBar() {
  const randomize = useMorphStore((state) => state.randomize);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20">
      <GlassPanel className="p-1.5 flex items-center gap-1 rounded-full border-white/10 shadow-xl bg-slate-900/40">
        <button
          onClick={randomize}
          className="p-3 hover:bg-white/10 rounded-full transition-all duration-200 text-white/70 hover:text-white hover:scale-105 active:scale-95 group"
          title="Shuffle"
        >
          <Shuffle size={18} className="group-hover:animate-pulse" />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          className="p-3 hover:bg-white/10 rounded-full transition-all duration-200 text-white/70 hover:text-white hover:scale-105 active:scale-95"
          title="Export"
        >
          <Download size={18} />
        </button>
      </GlassPanel>
    </div>
  );
}