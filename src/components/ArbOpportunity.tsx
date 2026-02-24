import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import { Target, ArrowRight, Play } from 'lucide-react';

interface ArbOpportunityProps {
    event: string;
    platformBuy: string;
    platformSell: string;
    buyPrice: number;
    sellPrice: number;
    netProfit: number;
    roi: number;
}

export function ArbOpportunity(props: ArbOpportunityProps) {
    return (
        <div className="relative group overflow-hidden glass-premium rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

            <div className="p-5 relative">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h3 className="font-bold text-sm tracking-tight text-white">{props.event}</h3>
                    </div>
                    <div className="bg-success/10 px-3 py-1 rounded-full border border-success/20">
                        <span className="text-success font-bold text-xs">
                            {formatPercent(props.roi)} Alpha
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-6 mb-6">
                    <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5">
                        <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Buy on {props.platformBuy}</p>
                        <span className="text-lg font-mono font-bold">${props.buyPrice?.toFixed(3) || '0.000'}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-700" />
                    <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5 text-right">
                        <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Sell on {props.platformSell}</p>
                        <span className="text-lg font-mono font-bold">${props.sellPrice?.toFixed(3) || '0.000'}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Net Exposure Advantage</span>
                        <span className="font-bold text-success">{formatCurrency(props.netProfit)} <span className="text-[10px] font-medium text-slate-500 ml-1">delta</span></span>
                    </div>
                    <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 group/btn">
                        <ArrowRight className="w-3 h-3" />
                        Review Alignment
                    </button>
                </div>
            </div>
        </div>
    );
}
