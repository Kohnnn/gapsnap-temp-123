'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Hourglass, ArrowRight, ExternalLink } from 'lucide-react';

type TradeStatus = 'submitting' | 'pending' | 'filled' | 'rejected';

interface TradeConfirmationProps {
    status: TradeStatus;
    market: string;
    side: 'YES' | 'NO';
    size: number;
    price: number;
    error?: string;
    onClose: () => void;
}

export default function TradeConfirmation({ status, market, side, size, price, error, onClose }: TradeConfirmationProps) {
    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        if (status === 'filled') {
            const timer = setTimeout(() => setAnimationDone(true), 100);
            return () => clearTimeout(timer);
        }
    }, [status]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="glass-premium w-full max-w-md p-8 flex flex-col items-center gap-6 relative overflow-hidden group/confetti animate-in zoom-in-90 slide-in-from-bottom-10 duration-500 ease-out">
                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none noise"></div>

                {/* Background Glow */}
                <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-colors duration-1000 ${status === 'filled' ? 'bg-[#10b981]' : status === 'rejected' ? 'bg-[#ef4444]' : 'bg-[#06b6d4]'
                    }`} />

                {/* Status Icon */}
                <div className="relative">
                    {status === 'submitting' && (
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-[#06b6d4] animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-[#06b6d4] uppercase tracking-tighter">API</span>
                            </div>
                        </div>
                    )}
                    {status === 'pending' && <Hourglass className="w-16 h-16 text-[#f59e0b] animate-pulse" />}
                    {status === 'filled' && (
                        <div className={`transition-all duration-500 transform ${animationDone ? 'scale-110' : 'scale-50 opacity-0'}`}>
                            <CheckCircle2 className="w-16 h-16 text-[#10b981]" />
                        </div>
                    )}
                    {status === 'rejected' && <XCircle className="w-16 h-16 text-[#ef4444] animate-bounce" />}
                </div>

                {/* Text Feedback */}
                <div className="text-center flex flex-col gap-1.5 z-10">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white drop-shadow-lg">
                        {status === 'submitting' && 'Submitting order'}
                        {status === 'pending' && 'Broadcasting...'}
                        {status === 'filled' && 'Execution Success'}
                        {status === 'rejected' && 'Execution Target Failed'}
                    </h2>
                    <p className="text-xs text-white/50 font-medium max-w-[280px] mx-auto leading-relaxed">
                        {status === 'submitting' && 'Syncing transaction with multi-platform liquidity relays.'}
                        {status === 'pending' && 'Order broadcasted to high-frequency matching engines.'}
                        {status === 'filled' && 'Your position vector has been successfully optimized.'}
                        {status === 'rejected' && (error || 'Market conditions drifted significantly. Execution aborted.')}
                    </p>
                </div>

                {/* Trade Details */}
                <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/30">
                        <span>Details</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-white/60">{market}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${side === 'YES' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                            }`}>
                            {side}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-mono font-bold">
                        <span className="text-white/80">{size.toLocaleString()} Contracts</span>
                        <div className="flex items-center gap-1 text-[#06b6d4]">
                            @ ${price.toFixed(2)}
                            <ArrowRight className="w-3 h-3 text-white/20" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full flex flex-col gap-2 pt-2">
                    {status === 'filled' && (
                        <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-white/70">
                            View on Explorer <ExternalLink className="w-3 h-3" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        disabled={status === 'submitting'}
                        className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${status === 'filled' ? 'bg-[#10b981] text-black hover:bg-[#10b981]/90 shadow-lg shadow-[#10b981]/20' :
                            status === 'rejected' ? 'bg-[#ef4444] text-white hover:bg-[#ef4444]/90' : 'bg-white/10 text-white/40 cursor-not-allowed'
                            }`}
                    >
                        {status === 'filled' || status === 'rejected' ? 'Close' : 'Please Wait'}
                    </button>
                </div>

                {/* Confetti simulation for success */}
                {status === 'filled' && animationDone && (
                    <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden pointer-events-none">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#10b981]/20 to-transparent animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
}
