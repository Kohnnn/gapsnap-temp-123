'use client';

import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, AlertCircle, Zap, Calculator } from 'lucide-react';
import AnimatedNumber from '@/components/AnimatedNumber';

interface QuickTradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    market?: {
        id: string;
        question: string;
        platform: string;
        yesPrice: number;
        noPrice: number;
    };
}

export default function QuickTradeModal({ isOpen, onClose, market }: QuickTradeModalProps) {
    const [side, setSide] = useState<'yes' | 'no'>('yes');
    const [amount, setAmount] = useState(100);
    const [probability, setProbability] = useState(60);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [prevMarketId, setPrevMarketId] = useState<string | undefined>(market?.id);

    // Reset probability when market changes (derived state pattern)
    if (market?.id !== prevMarketId) {
        setPrevMarketId(market?.id);
        setProbability(market ? Math.round(market.yesPrice * 100) : 60);
    }

    // Original effect removed to prevent sync setState warning

    if (!isOpen || !market) return null;

    const price = side === 'yes' ? market.yesPrice : market.noPrice;
    const contracts = Math.floor(amount / price);
    const maxProfit = contracts * (1 - price);
    const maxLoss = contracts * price;

    // Kelly calculation
    const p = probability / 100;
    const odds = (1 / price) - 1;
    const edge = p - price;
    const kelly = odds > 0 ? ((p * odds) - (1 - p)) / odds : 0;
    const halfKelly = Math.max(0, kelly * 0.5);
    const suggestedAllocation = Math.round(halfKelly * 10000); // Assuming $10k bankroll

    // Greeks preview
    const delta = p * (1 - p) * 4;
    const theta = -Math.abs(p - 0.5) * 0.5 / Math.sqrt(30 / 365) / 365 * amount;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg glass-premium rounded-2xl p-6 m-4 animate-slide-in-up">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calculator className="w-5 h-5 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                Position Analysis
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold text-white line-clamp-2">
                            {market.question}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">{market.platform}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Side Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={() => setSide('yes')}
                        className={`p-4 rounded-xl border-2 transition-all ${side === 'yes'
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-white/10 hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-emerald-400">YES</span>
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                            ${market.yesPrice.toFixed(2)}
                        </div>
                    </button>

                    <button
                        onClick={() => setSide('no')}
                        className={`p-4 rounded-xl border-2 transition-all ${side === 'no'
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-white/10 hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-red-400">NO</span>
                            <TrendingDown className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                            ${market.noPrice.toFixed(2)}
                        </div>
                    </button>
                </div>

                {/* Amount Slider */}
                <div className="mb-6">
                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Capital Allocation</span>
                        <span className="text-white font-mono">${amount}</span>
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>$10</span>
                        <span className="text-primary">Kelly suggests: ${suggestedAllocation}</span>
                        <span>$1,000</span>
                    </div>
                </div>

                {/* Probability Estimate */}
                <div className="mb-6">
                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Your Probability Estimate</span>
                        <span className={`font-mono ${edge > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {probability}% ({edge > 0 ? '+' : ''}{(edge * 100).toFixed(1)}% edge)
                        </span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="99"
                        value={probability}
                        onChange={(e) => setProbability(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Trade Preview */}
                <div className="grid grid-cols-4 gap-3 mb-6 p-4 rounded-xl bg-black/30">
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Contracts</div>
                        <div className="text-lg font-bold text-white">{contracts}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Max Profit</div>
                        <div className="text-lg font-bold text-emerald-400">
                            +${maxProfit.toFixed(0)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Max Loss</div>
                        <div className="text-lg font-bold text-red-400">
                            -${maxLoss.toFixed(0)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Delta</div>
                        <div className="text-lg font-bold text-cyan-400">
                            {delta.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Warning if negative edge */}
                {edge < 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-xs text-amber-400">
                            Negative expected value. Your probability ({probability}%) is below market price ({(price * 100).toFixed(0)}%).
                        </span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || amount <= 0}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all btn-ripple
                              ${side === 'yes'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400'
                            : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                        }
                              disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Placing Order...
                        </span>
                    ) : (
                        `Buy ${contracts} ${side.toUpperCase()} @ $${price.toFixed(2)}`
                    )}
                </button>

                {/* Keyboard hint */}
                <p className="text-center text-xs text-gray-600 mt-4">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400">ESC</kbd> to close
                </p>
            </div>
        </div>
    );
}
