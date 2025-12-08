import React from "react";
import { GlassPanel } from "../../components/ui/GlassPanel";
import { ArrowRight, Waves, Sparkles, Circle, Layers, Grid3x3, Droplet, Box, Orbit, Blend } from "lucide-react";
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

// New Flux Preview
const FluxPreview = () => (
    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
        <div className="absolute w-2 h-2 bg-purple-400 rounded-full top-1/4 left-1/4 shadow-[0_0_15px_rgba(192,132,252,0.8)] animate-pulse" />
        <div className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full top-1/2 left-2/3 shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-bounce" />
        <div className="absolute w-1 h-1 bg-white rounded-full top-3/4 left-1/3 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent)]" />
    </div>
);

const GridPreview = () => (
    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-4 transform rotate-12 scale-75 group-hover:scale-90 transition-transform duration-500">
            {Array.from({ length: 64 }).map((_, i) => (
                <div 
                    key={i} 
                    className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-sm opacity-60"
                    style={{ 
                        animationDelay: `${i * 20}ms`,
                        transform: `translateY(${Math.sin(i) * 10}px)`
                    }}
                />
            ))}
        </div>
    </div>
);

const SwarmPreview = () => (
    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
        {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const radius = 30 + (i % 3) * 20;
            const x = 50 + Math.cos(angle) * radius;
            const y = 50 + Math.sin(angle) * radius;
            return (
                <div 
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                    style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`
                    }}
                />
            );
        })}
    </div>
);

const SpiralPreview = () => (
    <div className="absolute inset-0 opacity-35 group-hover:opacity-55 transition-opacity duration-500">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
            <defs>
                <radialGradient id="spiral-grad">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>
            </defs>
            {[0, 1, 2].map(arm => {
                const points = Array.from({ length: 50 }, (_, i) => {
                    const t = i / 50;
                    const angle = arm * (Math.PI * 2 / 3) + t * Math.PI * 4;
                    const r = t * 80;
                    return `${100 + Math.cos(angle) * r},${100 + Math.sin(angle) * r}`;
                }).join(' ');
                return <polyline key={arm} points={points} fill="none" stroke="url(#spiral-grad)" strokeWidth="2" opacity="0.6" />;
            })}
        </svg>
    </div>
);

const NoisePreview = () => (
    <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 opacity-40 blur-2xl animate-pulse" />
        <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
        }} />
    </div>
);

const MeshPreview = () => (
    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500 flex items-center justify-center">
        <div className="relative w-32 h-32 group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 rounded-full border-4 border-red-400 opacity-30 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-rose-600 blur-xl opacity-50" />
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                <circle cx="50" cy="50" r="40" fill="none" stroke="url(#mesh-grad)" strokeWidth="2" opacity="0.8" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="url(#mesh-grad)" strokeWidth="1.5" opacity="0.6" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="url(#mesh-grad)" strokeWidth="1" opacity="0.4" />
                <defs>
                    <linearGradient id="mesh-grad">
                        <stop offset="0%" stopColor="#f87171" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    </div>
);

const CurveGradientPreview = () => (
    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 animate-gradient-shift" 
             style={{ 
                 backgroundSize: '400% 400%',
             }} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.3),transparent)] animate-pulse" />
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200">
            <path d="M 10 100 Q 50 50, 100 100 T 190 100" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" className="animate-float" />
            <path d="M 10 120 Q 50 170, 100 120 T 190 120" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" style={{ animationDelay: '0.5s' }} className="animate-float" />
        </svg>
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
                        title="Flux Field"
                        desc="Interactive particle flow simulation. Create stunning data streams."
                        icon={Sparkles}
                        path="/flux"
                        color="from-purple-500 to-indigo-600"
                        preview={FluxPreview}
                    />
                    <GeneratorCard 
                        title="Low Poly Grid"
                        desc="3D animated grid terrain with dynamic distortion and lighting."
                        icon={Grid3x3}
                        path="/grid"
                        color="from-emerald-500 to-teal-600"
                        preview={GridPreview}
                    />
                    <GeneratorCard 
                        title="Particle Swarm"
                        desc="Flocking behavior simulation with trails and interactive mouse control."
                        icon={Droplet}
                        path="/swarm"
                        color="from-cyan-500 to-blue-600"
                        preview={SwarmPreview}
                    />
                    <GeneratorCard 
                        title="Spiral Galaxy"
                        desc="Rotating spiral arms with star particles and glowing core effects."
                        icon={Orbit}
                        path="/spiral"
                        color="from-yellow-500 to-orange-600"
                        preview={SpiralPreview}
                    />
                    <GeneratorCard 
                        title="Noise Field"
                        desc="Perlin noise visualization with octaves, persistence, and animation."
                        icon={Layers}
                        path="/noise"
                        color="from-violet-500 to-fuchsia-600"
                        preview={NoisePreview}
                    />
                    <GeneratorCard 
                        title="Mesh Morph"
                        desc="3D morphing sphere with wave displacement and interactive camera."
                        icon={Box}
                        path="/mesh"
                        color="from-red-500 to-rose-600"
                        preview={MeshPreview}
                    />
                    <GeneratorCard 
                        title="Curve Gradient"
                        desc="Animated multi-color gradient with fractal noise curves and smooth transitions."
                        icon={Blend}
                        path="/curve"
                        color="from-amber-500 via-rose-500 to-violet-600"
                        preview={CurveGradientPreview}
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
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
              @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .animate-spin-slow {
                animation: spin-slow 20s linear infinite;
              }
              @keyframes gradient-shift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .animate-gradient-shift {
                animation: gradient-shift 10s ease infinite;
              }
            `}</style>
        </main>
    );
}