import React from "react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { ArrowRight, Waves, Box, Circle, Layers } from "lucide-react";
import { useMorphStore } from "../../store/useMorphStore";
import { cn } from "../../lib/utils";

// --- Preview Components ---

const BlobPreview = () => (
    <div className="absolute right-[-20%] bottom-[-20%] w-[80%] h-[80%] opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-float">
            <defs>
                <linearGradient id="blob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
            </defs>
            <path 
                fill="url(#blob-grad)" 
                d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.9C87.4,-34.7,90.1,-20.4,85.8,-7.1C81.5,6.2,70.2,18.5,60.5,29.6C50.8,40.7,42.7,50.6,33.4,58.3C24.1,66,13.6,71.5,-0.4,72.2C-14.4,72.9,-32.5,68.8,-47.4,60.2C-62.3,51.6,-74,38.5,-80.6,23.1C-87.2,7.7,-88.7,-10,-82.1,-25.4C-75.5,-40.8,-60.8,-53.9,-45.8,-60.8C-30.8,-67.7,-15.4,-68.4,0.6,-69.5C16.6,-70.6,33.2,-72.1,44.7,-76.4Z" 
                transform="translate(100 100)" 
            />
        </svg>
    </div>
);

const GradientPreview = () => (
    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 blur-3xl transform scale-150 animate-pulse" />
    </div>
);

const WavePreview = () => (
    <div className="absolute inset-x-0 bottom-0 h-3/4 opacity-30 group-hover:opacity-50 transition-all duration-500 group-hover:scale-y-110 origin-bottom">
        <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d">
            <path fill="#f59e0b" fillOpacity="0.6" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            <path fill="#ea580c" fillOpacity="0.6" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
    </div>
);

const GridPreview = () => (
    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 perspective-1000">
        <div className="absolute inset-[-50%] w-[200%] h-[200%] bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)] animate-[float_10s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    </div>
);


const GeneratorCard = ({ title, desc, icon: Icon, path, color, preview: Preview }: any) => {
    const { darkMode } = useMorphStore();
    
    const navigate = () => {
        window.dispatchEvent(new CustomEvent("morph-navigate", { detail: path }));
    };

    return (
        <div 
            onClick={navigate}
            className={cn(
                "group relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer hover:-translate-y-2 h-72",
                darkMode 
                    ? "bg-neutral-900/50 border-white/5 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-900/20" 
                    : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-xl"
            )}
        >
            {/* Live Preview Background */}
            <div className="absolute inset-0 overflow-hidden">
                <Preview />
            </div>

            <div className={cn("absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-10 bg-gradient-to-br", color)} />
            
            <div className="p-8 h-full flex flex-col justify-between relative z-10 pointer-events-none">
                <div>
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white bg-gradient-to-br shadow-lg backdrop-blur-sm", 
                        color
                    )}>
                        <Icon size={24} />
                    </div>
                    <h3 className={cn("text-2xl font-bold mb-2 drop-shadow-md", darkMode ? "text-white" : "text-slate-900")}>{title}</h3>
                    <p className={cn("text-sm leading-relaxed max-w-[85%] drop-shadow-sm font-medium", darkMode ? "text-neutral-300" : "text-slate-600")}>{desc}</p>
                </div>
                
                <div className="flex items-center gap-2 mt-4 font-bold text-sm group-hover:gap-4 transition-all duration-300">
                    <span className={cn("uppercase tracking-widest text-xs", darkMode ? "text-orange-400" : "text-blue-600")}>Open Tool</span>
                    <ArrowRight size={16} className={darkMode ? "text-orange-400" : "text-blue-600"} />
                </div>
            </div>
        </div>
    );
};

export default function ExplorePage() {
    const { darkMode } = useMorphStore();

    return (
        <main className={cn(
            // Changed from min-h-screen to h-screen with overflow-y-auto to enable scrolling
            "h-screen w-full px-6 py-20 transition-colors duration-500 overflow-y-auto custom-scrollbar",
            darkMode ? "bg-black selection:bg-orange-500/30" : "bg-slate-50 selection:bg-blue-500/20"
        )}>
            <div className="max-w-6xl mx-auto pb-20">
                <header className="mb-20 text-center">
                    <h1 className={cn("text-5xl md:text-7xl font-bold tracking-tighter mb-6", darkMode ? "text-white" : "text-slate-900")}>
                        The Studio
                    </h1>
                    <p className={cn("text-xl max-w-2xl mx-auto", darkMode ? "text-neutral-500" : "text-slate-500")}>
                        Select a generator to begin. All tools support high-resolution export and React code generation.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <GeneratorCard 
                        title="Blob Mesh"
                        desc="Create organic, fluid vector blobs with adjustable chaos and smoothness."
                        icon={Circle}
                        path="/create"
                        color="from-pink-500 to-rose-500"
                        preview={BlobPreview}
                    />
                    <GeneratorCard 
                        title="Blur Gradient"
                        desc="Generate ethereal, looping aurora backgrounds using WebGL."
                        icon={Layers}
                        path="/gradient"
                        color="from-blue-500 to-cyan-500"
                        preview={GradientPreview}
                    />
                    <GeneratorCard 
                        title="Layered Waves"
                        desc="Stacked sine-wave generator. Ideal for section dividers."
                        icon={Waves}
                        path="/waves"
                        color="from-amber-500 to-orange-600"
                        preview={WavePreview}
                    />
                    <GeneratorCard 
                        title="Neo-Grid"
                        desc="3D Terrain Grid distorted by noise. Retro-futuristic visuals."
                        icon={Box}
                        path="/grid"
                        color="from-purple-500 to-indigo-600"
                        preview={GridPreview}
                    />
                </div>
                
                <footer className="mt-20 text-center text-sm text-neutral-500">
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent("morph-navigate", { detail: "/" }))}
                        className="hover:underline opacity-50 hover:opacity-100 transition-opacity"
                    >
                        Back to Landing
                    </button>
                </footer>
            </div>
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
              }
            `}</style>
        </main>
    );
}