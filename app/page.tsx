import React from "react";
import BlobCanvas from "../components/canvas/BlobCanvas";
import FluidShader from "../components/canvas/FluidShader";
import { ArrowRight, Layers } from "lucide-react";

export default function LandingPage() {
  const navigate = (path: string) => {
    window.dispatchEvent(new CustomEvent("morph-navigate", { detail: path }));
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
            <span className="px-3 py-1 rounded-full border border-blue-200 bg-blue-100 text-xs font-mono tracking-widest text-blue-700 uppercase backdrop-blur-md shadow-lg shadow-blue-500/20">
                v2.0.0 Dual Suite
            </span>
        </div>

        {/* Headline */}
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 text-slate-900 drop-shadow-sm animate-fade-in-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
          Morph.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-slate-700 max-w-xl mb-10 leading-relaxed font-light animate-fade-in-up opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
          The open-source generative design studio. Create organic vector blobs and fluid gradient meshes in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 animate-fade-in-up opacity-0 [animation-delay:800ms] [animation-fill-mode:forwards]">
            <button
              onClick={() => navigate('/create')}
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold tracking-tight transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/30 flex items-center gap-2"
            >
              Blob Generator
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/gradient')}
              className="group relative px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-full font-semibold tracking-tight transition-all hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              Blur Gradients
              <Layers size={18} className="text-blue-500" />
            </button>
        </div>

      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-30 text-slate-500 text-xs">
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