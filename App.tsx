import React, { useState, useEffect } from 'react';
import { AppConfig, ModelType, Language, VoiceoverLanguage, ScriptContent } from './types';
import { generateVideoScript } from './services/geminiService';
import ConfigSection from './components/ConfigSection';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';
import { Sparkles } from 'lucide-react';

const LOADING_STEPS = [
    "Menganalisa ide jenius lo... 🧠",
    "Meracik visual style sinematik... 🎨",
    "Menyusun timeline & skrip... 📝",
    "Mengoptimalkan metadata SEO... ⚡",
    "Finishing touch... ✨"
];

const App: React.FC = () => {
    const [config, setConfig] = useState<AppConfig>({
        model: ModelType.VEO, // Default Veo
        sceneCount: 8,
        promptLang: Language.ENGLISH,
        voLang: VoiceoverLanguage.INDONESIAN
    });

    const [idea, setIdea] = useState("");
    const [result, setResult] = useState<ScriptContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingStep, setLoadingStep] = useState(0);

    // Effect untuk animasi loading text
    useEffect(() => {
        let interval: any;
        if (isLoading) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerate = async () => {
        if (!idea.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await generateVideoScript(idea, config);
            setResult(data);
        } catch (err: any) {
            console.error("Generation failed:", err);
            setError(err.message || "Failed to generate script. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate progress percentage
    const progressPercentage = Math.min(98, Math.round(((loadingStep + 1) / LOADING_STEPS.length) * 100));

    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl sm:text-7xl font-black mb-4 brand-logo tracking-tight">
                        FixoraPromt
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Platform cerdas untuk meracik skrip video viral. Pilih model, atur bahasa, dan biarkan AI bekerja magic untuk konten lo. ✨
                    </p>
                </div>

                <ConfigSection config={config} setConfig={setConfig} />
                
                <InputSection 
                    idea={idea} 
                    setIdea={setIdea} 
                    onGenerate={handleGenerate} 
                    isLoading={isLoading} 
                />

                {isLoading && (
                    <div className="py-12 w-full animate-fade-in-up">
                        <div className="relative bg-slate-900/40 border border-slate-700/30 rounded-2xl p-8 overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                            
                            {/* Background Grid Animation */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                                style={{ 
                                    backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)',
                                    backgroundSize: '40px 40px',
                                    maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                                }}>
                            </div>

                            {/* Main Core Animation */}
                            <div className="relative w-32 h-32 mb-8">
                                {/* Outer Rings */}
                                <div className="absolute inset-0 rounded-full border border-slate-600 border-dashed animate-spin-slow"></div>
                                <div className="absolute inset-[-10px] rounded-full border border-indigo-500/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                                
                                {/* Pulse Rings */}
                                <div className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping duration-[2s]"></div>
                                <div className="absolute inset-4 rounded-full bg-purple-500/10 animate-ping delay-75 duration-[2s]"></div>

                                {/* Center Core */}
                                <div className="absolute inset-2 rounded-full border-2 border-t-indigo-400 border-r-transparent border-b-purple-400 border-l-transparent animate-spin"></div>
                                
                                {/* Inner Content */}
                                <div className="absolute inset-6 rounded-full bg-slate-900 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] z-10 border border-slate-700/50">
                                    <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                                </div>
                            </div>

                            {/* Progress Bar & Steps */}
                            <div className="w-full max-w-md space-y-4 relative z-10">
                                <div className="flex justify-between text-xs font-mono text-indigo-300/70">
                                    <span>STATUS: GENERATING</span>
                                    <span>PROCESS: {progressPercentage}%</span>
                                </div>
                                
                                {/* Custom Progress Bar */}
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                                     <div 
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out"
                                        style={{ width: `${progressPercentage}%` }}
                                     >
                                        <div className="absolute inset-0 bg-white/30 animate-shimmer w-full"></div>
                                     </div>
                                </div>

                                <div className="text-center mt-4 h-12">
                                     <h3 key={loadingStep} className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 animate-fade-in-up">
                                        {LOADING_STEPS[loadingStep]}
                                    </h3>
                                    <p className="text-slate-500 text-xs mt-1 font-mono">AI Agent is thinking...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-center animate-fade-in-up">
                        {error}
                    </div>
                )}

                {result && (
                    <ResultSection 
                        content={result} 
                        voLang={config.voLang} 
                        promptLang={config.promptLang} 
                    />
                )}
            </div>
        </div>
    );
};

export default App;