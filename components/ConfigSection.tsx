import React from 'react';
import { AppConfig, ModelType, Language, VoiceoverLanguage } from '../types';
import { Video, Clock, Layers, Volume2, Mic } from 'lucide-react';

interface ConfigSectionProps {
    config: AppConfig;
    setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ config, setConfig }) => {
    
    const handleModelChange = (model: ModelType) => {
        setConfig(prev => ({ ...prev, model }));
    };

    const handleSceneCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConfig(prev => ({ 
            ...prev, 
            model: ModelType.VEO3,
            sceneCount: parseInt(e.target.value) 
        }));
    };

    const handlePromptLangChange = (lang: Language) => {
        setConfig(prev => ({ ...prev, promptLang: lang }));
    };

    const handleVoLangChange = (lang: VoiceoverLanguage) => {
        setConfig(prev => ({ ...prev, voLang: lang }));
    };

    return (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</div>
                <h2 className="text-xl font-bold text-slate-200">Konfigurasi Model & Bahasa</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Model Selection */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Model AI</label>
                    
                    {/* Sora Option */}
                    <div 
                        onClick={() => handleModelChange(ModelType.SORA)}
                        className={`cursor-pointer group flex items-center p-4 rounded-xl border transition-all duration-200 ${
                            config.model === ModelType.SORA 
                            ? 'bg-indigo-500/10 border-indigo-500' 
                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${config.model === ModelType.SORA ? 'border-indigo-400' : 'border-slate-500'}`}>
                            {config.model === ModelType.SORA && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                        </div>
                        <div>
                            <span className="block text-white font-semibold text-lg">Sora</span>
                            <span className="text-sm text-slate-400 flex items-center gap-1"><Clock size={14}/> 15 Detik</span>
                        </div>
                    </div>

                    {/* Veo Option */}
                    <div 
                        onClick={() => handleModelChange(ModelType.VEO)}
                        className={`cursor-pointer group flex items-center p-4 rounded-xl border transition-all duration-200 ${
                            config.model === ModelType.VEO 
                            ? 'bg-indigo-500/10 border-indigo-500' 
                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${config.model === ModelType.VEO ? 'border-indigo-400' : 'border-slate-500'}`}>
                            {config.model === ModelType.VEO && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                        </div>
                        <div>
                            <span className="block text-white font-semibold text-lg">Veo</span>
                            <span className="text-sm text-slate-400 flex items-center gap-1"><Clock size={14}/> 8 Detik</span>
                        </div>
                    </div>

                    {/* Veo Storytelling Option */}
                    <div 
                        onClick={() => handleModelChange(ModelType.VEO3)}
                        className={`cursor-pointer group flex flex-col p-4 rounded-xl border transition-all duration-200 ${
                            config.model === ModelType.VEO3 
                            ? 'bg-emerald-500/10 border-emerald-500' 
                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        <div className="flex items-center mb-3">
                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center ${config.model === ModelType.VEO3 ? 'border-emerald-400' : 'border-slate-500'}`}>
                                {config.model === ModelType.VEO3 && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                            </div>
                            <div>
                                <span className="block text-white font-semibold text-lg flex items-center gap-2">
                                    Veo Storytelling
                                </span>
                                <span className="text-sm text-slate-400 flex items-center gap-1"><Layers size={14}/> Multi-scene @ 8 Detik</span>
                            </div>
                        </div>
                        
                        <div className="mt-2 sm:mt-0 ml-0 sm:ml-9 bg-slate-900/50 p-3 sm:p-2 rounded-lg border border-slate-700/50 max-w-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider whitespace-nowrap flex-shrink-0">Jumlah Scene:</span>
                                <select 
                                    value={config.sceneCount}
                                    onChange={handleSceneCountChange}
                                    className="w-full sm:w-auto bg-slate-800 text-white text-xs border border-slate-600 rounded px-2 py-2 sm:py-1 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer hover:bg-slate-700 transition-colors"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                        <option key={num} value={num}>{num} Scene ({num * 8} Detik)</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Language Settings */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bahasa Output</label>
                    
                    <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 h-full flex flex-col justify-center">
                        <div className="mb-6">
                            <span className="block text-xs font-bold text-sky-400 uppercase mb-2 tracking-widest">Prompt Visual</span>
                            <div className="flex flex-wrap gap-3 items-center">
                                <button
                                    onClick={() => handlePromptLangChange(Language.ENGLISH)}
                                    className={`flex items-center justify-center px-4 h-10 rounded-lg border transition-all text-sm font-medium ${config.promptLang === Language.ENGLISH ? 'bg-sky-500/20 border-sky-500 text-sky-200' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                                >
                                    🇺🇸 English
                                </button>
                                <button
                                    onClick={() => handlePromptLangChange(Language.INDONESIAN)}
                                    className={`flex items-center justify-center px-4 h-10 rounded-lg border transition-all text-sm font-medium ${config.promptLang === Language.INDONESIAN ? 'bg-sky-500/20 border-sky-500 text-sky-200' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                                >
                                    🇮🇩 Indonesia
                                </button>
                            </div>
                        </div>

                        <div>
                            <span className="block text-xs font-bold text-emerald-400 uppercase mb-2 tracking-widest">Audio & Voiceover</span>
                            <div className="flex flex-wrap gap-3 items-center">
                                <button
                                    onClick={() => handleVoLangChange(VoiceoverLanguage.INDONESIAN)}
                                    className={`flex items-center justify-center px-4 h-10 rounded-lg border transition-all text-sm font-medium gap-2 ${config.voLang === VoiceoverLanguage.INDONESIAN ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                                >
                                    <Mic size={14} /> 🇮🇩 Indonesia
                                </button>
                                <button
                                    onClick={() => handleVoLangChange(VoiceoverLanguage.ENGLISH)}
                                    className={`flex items-center justify-center px-4 h-10 rounded-lg border transition-all text-sm font-medium gap-2 ${config.voLang === VoiceoverLanguage.ENGLISH ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                                >
                                    <Mic size={14} /> 🇺🇸 English
                                </button>
                                <button
                                    onClick={() => handleVoLangChange(VoiceoverLanguage.SFX)}
                                    className={`flex items-center justify-center px-4 h-10 rounded-lg border transition-all text-sm font-medium gap-2 ${config.voLang === VoiceoverLanguage.SFX ? 'bg-rose-500/20 border-rose-500 text-rose-200' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`}
                                >
                                    <Volume2 size={14} /> Tanpa VO (SFX)
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 italic">*Mode SFX hanya menghasilkan Sound Effect tanpa suara manusia.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigSection;
