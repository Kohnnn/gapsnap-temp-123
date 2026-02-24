import { cn, formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface MarketCardProps {
    platform: string;
    question: string;
    yesPrice: number;
    noPrice: number;
    volume24h: number;
    spread: number;
}

export function MarketCard({ platform, question, yesPrice, noPrice, volume24h, spread }: MarketCardProps) {
    return (
        <div className="glass rounded-xl p-5 card-hover flex flex-col h-full border border-white/5">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                    {platform}
                </span>
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>Maturity: 12d</span>
                </div>
            </div>

            <h3 className="font-semibold text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                {question}
            </h3>

            <div className="mt-auto grid grid-cols-2 gap-3 mb-4">
                <div className="bg-success/5 border border-success/10 rounded-lg p-3 group hover:border-success/30 transition-colors">
                    <p className="text-[10px] uppercase font-bold text-success/60 mb-1 tracking-tighter">Prob YES</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-success">{(yesPrice * 100).toFixed(1)}%</span>
                        <TrendingUp className="w-3 h-3 text-success/40" />
                    </div>
                </div>
                <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-3 group hover:border-destructive/30 transition-colors">
                    <p className="text-[10px] uppercase font-bold text-destructive/60 mb-1 tracking-tighter">Prob NO</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-destructive">{(noPrice * 100).toFixed(1)}%</span>
                        <TrendingDown className="w-3 h-3 text-destructive/40" />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-600 border-t border-white/5 pt-4">
                <div className="flex flex-col">
                    <span>Vol 24h</span>
                    <span className="text-zinc-400 font-mono mt-0.5">${(volume24h / 1000)?.toFixed(1) || '0.0'}k</span>
                </div>
                <div className="flex flex-col items-end">
                    <span>Spread</span>
                    <span className="text-zinc-400 font-mono mt-0.5">{(spread * 100)?.toFixed(2) || '0.00'}%</span>
                </div>
            </div>
        </div>
    );
}
