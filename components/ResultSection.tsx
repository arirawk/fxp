import React, { useState } from 'react';
import { ScriptContent, VoiceoverLanguage } from '../types';
import { Copy, Check, Camera, Clapperboard, MapPin, Mic, Volume2 } from 'lucide-react';

interface ResultSectionProps {
    content: ScriptContent;
    voLang: VoiceoverLanguage;
    promptLang: string;
}

const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = "Salin" }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button 
            onClick={handleCopy} 
            className={`text-xs flex items-center gap-1 transition-colors ${copied ? 'text-emerald-400' : 'text-indigo-400 hover:text-indigo-300'}`}
        >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Tersalin' : label}
        </button>
    );
};

const ResultSection: React.FC<ResultSectionProps> = ({ content, voLang, promptLang }) => {
    
    const handleCopyScript = () => {
        const fullScript = content.script_timeline.map(item => {
            const voPrefix = voLang === VoiceoverLanguage.SFX ? '' : '🎙️ VO: ';
            const voLine = item.voiceover ? `\n${voPrefix}${item.voiceover}` : '';
            return `${item.timestamp} - ${item.label}\n${item.action}${voLine}`;
        }).join('\n\n');
        navigator.clipboard.writeText(fullScript);
        alert("Script copied to clipboard!");
    };

    return (
        <div className="mt-10 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4 mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-indigo-500">✦</span> Hasil Cooked Abis 🔥
                </h2>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Visual Style */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                    <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Clapperboard size={16} /> Visual Style
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">{content.style}</p>
                    <CopyButton text={content.style} />
                </div>

                {/* Camera */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                    <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Camera size={16} /> Camera Movement
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">{content.camera}</p>
                    <CopyButton text={content.camera} />
                </div>

                {/* Environment */}
                <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MapPin size={16} /> Environment
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-3">{content.scene}</p>
                    <CopyButton text={content.scene} />
                </div>
            </div>

            {/* Timeline Section */}
            <div className="mb-10">
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-2xl font-bold text-slate-200">Timeline & Skrip</h3>
                    <button 
                        onClick={handleCopyScript}
                        className="py-2 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    >
                        <Copy size={16} /> Salin Full
                    </button>
                </div>
                
                <div className="relative space-y-0 pl-4 border-l-2 border-slate-800">
                    {content.script_timeline.map((item, index) => {
                        const isSFX = voLang === VoiceoverLanguage.SFX || item.voiceover?.trim().startsWith('[SFX]');
                        
                        const sceneJsonData = {
                            timestamp: item.timestamp,
                            prompt_context: `${content.style}. ${content.scene}. ${item.action}. ${content.camera}`,
                            voiceover: item.voiceover || null
                        };

                        return (
                            <div key={index} className="timeline-item ml-2 relative pb-8 pl-6 border-l border-indigo-500/30 last:border-l-0 last:pb-0">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-indigo-500 box-content border-4 border-slate-900 shadow-[0_0_0_1px_rgba(99,102,241,0.3)]" />

                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold text-indigo-300 bg-indigo-900/40 px-2 py-1 rounded-md border border-indigo-500/20">{item.timestamp}</span>
                                    <span className="text-xs font-bold uppercase text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">{item.label}</span>
                                </div>
                                
                                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors group">
                                    <div className="mb-2">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Visual Prompt ({promptLang})</p>
                                        </div>
                                        <p className="text-slate-200 leading-relaxed text-sm">{item.action}</p>
                                    </div>

                                    {item.voiceover && (
                                        <div className={`mt-3 p-3 border-l-2 rounded-r-lg ${isSFX ? 'bg-rose-900/20 border-rose-500/50' : 'bg-emerald-900/20 border-emerald-500/50'}`}>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${isSFX ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {isSFX ? <Volume2 size={10}/> : <Mic size={10}/>} {isSFX ? 'Audio / SFX' : `Voiceover (${voLang})`}
                                            </p>
                                            <p className="text-slate-200 italic text-sm">"{item.voiceover}"</p>
                                        </div>
                                    )}

                                    <div className="mt-4 pt-3 border-t border-slate-700/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-mono text-slate-500">JSON Data</span>
                                            <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <CopyButton text={item.action} label="Copy Prompt" />
                                                <span className="text-slate-700">|</span>
                                                <CopyButton text={JSON.stringify(sceneJsonData, null, 2)} label="Copy JSON" />
                                            </div>
                                        </div>
                                        <pre className="font-mono text-[10px] leading-relaxed text-sky-300/80 whitespace-pre-wrap break-all bg-slate-900/50 p-2 rounded-lg border border-slate-800 overflow-x-auto">
                                            {JSON.stringify(sceneJsonData, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SEO Section */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-lg font-bold text-slate-200 mb-5 flex items-center gap-2">
                    <span className="text-amber-400">⚡</span> SEO Metadata
                </h3>
                
                <div className="grid gap-5">
                    {/* Title */}
                    <div className="group">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase">Judul Video</span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity"><CopyButton text={content.seo_title} /></div>
                        </div>
                        <p className="text-white font-medium bg-slate-800 p-3 rounded-lg border border-slate-700 text-sm">{content.seo_title}</p>
                    </div>

                    {/* Description */}
                    <div className="group">
                        <div className="flex justify-between mb-1">
                            <span className="text-xs font-bold text-slate-500 uppercase">Deskripsi</span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity"><CopyButton text={content.description} /></div>
                        </div>
                        <p className="text-slate-300 text-sm bg-slate-800 p-3 rounded-lg border border-slate-700">{content.description}</p>
                    </div>

                    {/* Grid for CTA & Hashtags */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="group">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase">Call To Action</span>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity"><CopyButton text={content.cta_seo} /></div>
                            </div>
                            <p className="text-emerald-400 text-sm italic bg-slate-800 p-3 rounded-lg border border-slate-700">{content.cta_seo}</p>
                        </div>
                        <div className="group">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-bold text-slate-500 uppercase">Hashtags</span>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity"><CopyButton text={content.hashtags} /></div>
                            </div>
                            <p className="text-blue-400 text-sm bg-slate-800 p-3 rounded-lg border border-slate-700">{content.hashtags}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultSection;