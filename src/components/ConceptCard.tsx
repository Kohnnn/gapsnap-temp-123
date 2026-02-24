'use client';

import React from 'react';
import { Info, HelpCircle, BookOpen } from 'lucide-react';

interface ConceptCardProps {
    title: string;
    concept: string;
    description: string;
    formula?: string;
    className?: string;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
    title,
    concept,
    description,
    formula,
    className
}) => {
    return (
        <div className={`p-5 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-md ${className}`}>
            <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Technical Concept</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {description}
            </p>

            {formula && (
                <div className="bg-black/30 rounded-lg p-3 font-mono text-center text-sm text-primary border border-primary/20 mb-4">
                    {formula}
                </div>
            )}

            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300">
                    <span className="font-bold block mb-1 text-white">Why it matters:</span>
                    {concept}
                </div>
            </div>
        </div>
    );
};
