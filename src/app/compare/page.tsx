'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Shuffle, ArrowRight, ExternalLink, TrendingUp, AlertCircle, ShoppingCart } from 'lucide-react';

const MOCK_COMPARISONS = [
    {
        id: '1',
        event: 'US GDP Growth Q1 2026',
        platforms: [
            { name: 'Polymarket', price: 0.45, liquidity: '$1.2M', volume: '$250k' },
            { name: 'Kalshi', price: 0.48, liquidity: '$800k', volume: '$120k' }
        ],
        spread: 0.03,
        spreadPercent: 6.67,
        opportunity: 'Arbitrage High'
    },
    {
        id: '2',
        event: 'Bitcoin hits $100k by March',
        platforms: [
            { name: 'Polymarket', price: 0.58, liquidity: '$15M', volume: '$2.1M' },
            { name: 'Kalshi', price: 0.57, liquidity: '$5M', volume: '$800k' }
        ],
        spread: 0.01,
        spreadPercent: 1.72,
        opportunity: 'Low'
    },
    {
        id: '3',
        event: 'Fed Rates Cut in March Meeting',
        platforms: [
            { name: 'Polymarket', price: 0.38, liquidity: '$4.2M', volume: '$600k' },
            { name: 'Kalshi', price: 0.42, liquidity: '$2.1M', volume: '$450k' }
        ],
        spread: 0.04,
        spreadPercent: 10.5,
        opportunity: 'Arbitrage High'
    }
];

export default function ComparePage() {
    return (
        <main className="min-h-screen bg-[#0a0a0f] text-white">
            <Header />

            <div className="container mx-auto px-6 py-8 flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight gradient-text">Platform Comparison</h1>
                    <p className="text-white/40 mt-1">Cross-exchange spread detection and arbitrage analysis</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {MOCK_COMPARISONS.map((comp) => (
                        <div key={comp.id} className="glass-card overflow-hidden group border-white/5 hover:border-white/10 transition-all">
                            <div className="bg-white/2 p-4 border-b border-white/5 flex justify-between items-center">
                                <h2 className="font-bold text-lg">{comp.event}</h2>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${comp.spreadPercent > 5 ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-white/5 text-white/40'
                                    }`}>
                                    <TrendingUp className="w-3 h-3" />
                                    {comp.spreadPercent.toFixed(2)}% Spread
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 lg:grid-cols-11 gap-8 items-center">
                                {/* Platform 1 */}
                                <div className="lg:col-span-4 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">P</div>
                                            <span className="text-sm font-bold opacity-70">{comp.platforms[0].name}</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-white/20 hover:text-white/60 cursor-pointer" />
                                    </div>
                                    <div className="text-4xl font-mono font-bold text-white/90">
                                        ${comp.platforms[0].price.toFixed(2)}
                                    </div>
                                    <div className="flex gap-4 text-[10px] text-white/30 uppercase font-bold">
                                        <span>Liq: {comp.platforms[0].liquidity}</span>
                                        <span>Vol: {comp.platforms[0].volume}</span>
                                    </div>
                                </div>

                                {/* Arrow/Connector */}
                                <div className="lg:col-span-1 flex justify-center">
                                    <div className="p-3 bg-white/5 rounded-full border border-white/10 group-hover:bg-[#06b6d4]/10 group-hover:border-[#06b6d4]/30 transition-all">
                                        <Shuffle className="w-5 h-5 text-white/20 group-hover:text-[#06b6d4]" />
                                    </div>
                                </div>

                                {/* Platform 2 */}
                                <div className="lg:col-span-4 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-400 font-bold">K</div>
                                            <span className="text-sm font-bold opacity-70">{comp.platforms[1].name}</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-white/20 hover:text-white/60 cursor-pointer" />
                                    </div>
                                    <div className="text-4xl font-mono font-bold text-white/90">
                                        ${comp.platforms[1].price.toFixed(2)}
                                    </div>
                                    <div className="flex gap-4 text-[10px] text-white/30 uppercase font-bold">
                                        <span>Liq: {comp.platforms[1].liquidity}</span>
                                        <span>Vol: {comp.platforms[1].volume}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="lg:col-span-2 flex lg:flex-col gap-3">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#06b6d4] hover:bg-[#06b6d4]/80 rounded-xl text-black font-bold text-xs transition-all shadow-lg shadow-[#06b6d4]/20">
                                        <ShoppingCart className="w-4 h-4" />
                                        Arb Execute
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-xs transition-all">
                                        Watch Event
                                    </button>
                                </div>
                            </div>

                            {/* Risk/Opportunity Label */}
                            <div className="px-6 py-2 bg-white/2 border-t border-white/5 flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${comp.spreadPercent > 5 ? 'text-emerald-400' : 'text-white/20'
                                    }`}>
                                    {comp.spreadPercent > 5 ? <AlertCircle className="w-3 h-3" /> : null}
                                    {comp.opportunity}
                                </span>
                                <span className="text-[10px] text-white/20 italic">Last updated: 2s ago</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
