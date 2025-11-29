import React from "react";
import BlobCanvas from "../components/canvas/BlobCanvas";
import FluidShader from "../components/canvas/FluidShader";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const handleOpenGenerator = () => {
    // Dispatch custom event for memory routing to avoid SecurityError on sandboxed iframes/blobs
    window.dispatchEvent(new CustomEvent("morph-navigate", { detail: "/create" }));
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-950 text-white selection:bg-teal-500/30">
      {/* Background Layer: Non-interactive visual demo */}
      <FluidShader />
      <BlobCanvas interactive={false} />

      {/* Overlay: Gradient to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-20" />

      {/* Hero Content */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-4">
        
        {/* Animated Badge */}
        <div className="mb-6 animate-fade-in-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono tracking-widest text-blue-200 uppercase backdrop-blur-md">
                v1.0.0 Public Beta
            </span>
        </div>

        {/* Headline */}
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 animate-fade-in-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
          Morph.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/60 max-w-xl mb-10 leading-relaxed font-light animate-fade-in-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
          The open-source generative design studio. Create organic vector blobs and fluid shaders in seconds.
        </p>

        {/* CTA Button */}
        <button
          onClick={handleOpenGenerator}
          className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold tracking-tight transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-2 animate-fade-in-up opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]"
        >
          Open Generator
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-30 text-white/20 text-xs">
        <p>Built with Next.js, R3F & Tailwind</p>
      </div>

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation-name: fadeInUp;
            animation-duration: 0.8s;
            animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
        }
      `}</style>
    </main>
  );
}