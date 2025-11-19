import React, { useState, useRef, useEffect } from 'react';
import { Dice5, Sparkles } from 'lucide-react';
import { RANDOM_PROMPTS } from '../constants';

interface InputSectionProps {
    idea: string;
    setIdea: React.Dispatch<React.SetStateAction<string>>;
    onGenerate: () => void;
    isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ idea, setIdea, onGenerate, isLoading }) => {
    const [isGeneratingRandom, setIsGeneratingRandom] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea logic
    useEffect(() => {
        if (textareaRef.current) {
            // Reset height to auto to allow shrinking when text is deleted
            textareaRef.current.style.height = 'auto';
            // Set new height based on scrollHeight, with a minimum fallback
            const newHeight = Math.max(120, textareaRef.current.scrollHeight);
            textareaRef.current.style.height = `${newHeight}px`;
        }
    }, [idea]);

    const handleRandomIdea = () => {
        setIsGeneratingRandom(true);
        const randomIndex = Math.floor(Math.random() * RANDOM_PROMPTS.length);
        setIdea(RANDOM_PROMPTS[randomIndex]);
        setTimeout(() => setIsGeneratingRandom(false), 300);
    };

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">2</div>
                <label htmlFor="videoIdea" className="text-xl font-bold text-slate-200">Ide Konten</label>
            </div>
            
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                <textarea 
                    ref={textareaRef}
                    id="videoIdea" 
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Tulis ide gila lo di sini, atau klik tombol random di bawah buat inspirasi..."
                    className={`relative w-full p-5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-lg shadow-inner min-h-[120px] resize-none overflow-hidden whitespace-pre-wrap break-words ${isGeneratingRandom ? 'ring-2 ring-indigo-500' : ''}`}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div 
                    onClick={handleRandomIdea} 
                    className="col-span-2 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-800 hover:border-indigo-500/30 flex items-center gap-4 group transition-all duration-300 hover:-translate-y-0.5"
                >
                    <div className="p-2.5 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                        <Dice5 className="w-6 h-6 text-indigo-400 transition-transform duration-500 group-hover:rotate-180" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">Buntu Ide? Klik Random! 🎲</h4>
                        <p className="text-xs text-slate-500 group-hover:text-slate-400">Dapatkan ide konten fresh instan.</p>
                    </div>
                </div>

                <button 
                    onClick={onGenerate}
                    disabled={isLoading || !idea.trim()}
                    className="col-span-1 w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:hover:translate-y-0"
                >
                    <span>{isLoading ? 'Generating...' : 'Generate'}</span>
                    {!isLoading && <Sparkles className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

export default InputSection;