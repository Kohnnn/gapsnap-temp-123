'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Activity, ArrowUp, ArrowDown } from 'lucide-react';

interface BlotterItem {
    id: string;
    timestamp: Date;
    market: string;
    price: number;
    change: number;
    side: 'BUY' | 'SELL';
    platform: 'Polymarket' | 'Kalshi' | 'PredictX';
}

const MARKETS = [
    'BTC hit $100k',
    'Fed Rate Cut',
    'US GDP > 2.5%',
    'Nvidia Earnings',
    'SpaceX Launch',
    'Tesla Robotaxi',
    'Apple Vision Pro 2'
];

export default function LiveBlotter({ className }: { className?: string }) {
    const [updates, setUpdates] = useState<BlotterItem[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Simulate real-time updates
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            const newUpdate: BlotterItem = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date(),
                market: MARKETS[Math.floor(Math.random() * MARKETS.length)],
                price: parseFloat((Math.random()).toFixed(2)),
                change: (Math.random() * 0.1) - 0.05,
                side: Math.random() > 0.5 ? 'BUY' : 'SELL',
                platform: ['Polymarket', 'Kalshi', 'PredictX'][Math.floor(Math.random() * 3)] as 'Polymarket' | 'Kalshi' | 'PredictX',
            };

            setUpdates(prev => [newUpdate, ...prev].slice(0, 50));
        }, 2000);

        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div
            className={`glass-premium h-full flex flex-col noise ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4] animate-pulse"></span>
                        Live Transaction Blotter
                    </h3>
                    <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest">Global Order Stream</p>
                </div>
                {isPaused && (
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20 animate-pulse">
                        PAUSED
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-x-0 h-10 top-0 bg-gradient-to-b from-[#0a0a0f] to-transparent z-10 opacity-50"></div>
                <div className="absolute inset-x-0 h-10 bottom-0 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10 opacity-50"></div>

                <div className="p-2 space-y-1">
                    {updates.map((update) => (
                        <div
                            key={update.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group/item animate-in slide-in-from-right-4 duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-1 h-8 rounded-full ${update.side === 'BUY' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}></div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white tracking-tight">{update.market}</span>
                                        <span className={`text-[10px] font-black ${update.side === 'BUY' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                                            {update.side}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-white/30 font-mono italic">{update.platform}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm font-mono font-bold text-white">
                                    ${update.price.toFixed(2)}
                                </div>
                                <div className="text-[10px] text-white/40 font-mono">
                                    {update.timestamp.toLocaleTimeString([], { hour12: false })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {updates.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-white/10 gap-2">
                            <Activity className="w-8 h-8 animate-pulse" />
                            <p className="text-[10px] uppercase font-bold tracking-widest">Waiting for data...</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-2 border-t border-white/5 bg-white/2 flex justify-center">
                <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">Auto-updates every 2s</p>
            </div>
        </div>
    );
}
