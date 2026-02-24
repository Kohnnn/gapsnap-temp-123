'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
    id: string;
    symbol: string;
    platform: string;
    price: number;
    change: number;
    changePercent: number;
}

interface PriceTickerProps {
    items?: TickerItem[];
    speed?: number;
    className?: string;
}

const defaultItems: TickerItem[] = [
    { id: '1', symbol: 'BTC $100K', platform: 'Polymarket', price: 0.68, change: 0.03, changePercent: 4.6 },
    { id: '2', symbol: 'Fed Rate Cut', platform: 'Kalshi', price: 0.52, change: -0.02, changePercent: -3.7 },
    { id: '3', symbol: 'Trump Win', platform: 'Polymarket', price: 0.55, change: 0.05, changePercent: 10.0 },
    { id: '4', symbol: 'ETH $5K', platform: 'Manifold', price: 0.45, change: 0.01, changePercent: 2.3 },
    { id: '5', symbol: 'AI Winter', platform: 'Metaculus', price: 0.22, change: -0.03, changePercent: -12.0 },
    { id: '6', symbol: 'S&P +20%', platform: 'Kalshi', price: 0.38, change: 0.02, changePercent: 5.6 },
    { id: '7', symbol: 'Ukraine Peace', platform: 'Polymarket', price: 0.33, change: 0.04, changePercent: 13.8 },
    { id: '8', symbol: 'Recession 2026', platform: 'Kalshi', price: 0.28, change: -0.01, changePercent: -3.4 },
];

export default function PriceTicker({
    items = defaultItems,
    speed = 50,
    className = '',
}: PriceTickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [flashingId, setFlashingId] = useState<string | null>(null);

    // Simulate price updates
    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * items.length);
            const item = items[randomIndex];
            setFlashingId(item.id);
            setTimeout(() => setFlashingId(null), 500);
        }, 3000);

        return () => clearInterval(interval);
    }, [items]);

    const platformColors: Record<string, string> = {
        'Polymarket': 'text-cyan-400',
        'Kalshi': 'text-purple-400',
        'Manifold': 'text-pink-400',
        'Metaculus': 'text-amber-400',
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden bg-black/40 border-y border-white/5 ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                ref={contentRef}
                className="flex whitespace-nowrap"
                style={{
                    animation: `scroll ${speed}s linear infinite`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}
            >
                {/* Duplicate items for seamless loop */}
                {[...items, ...items].map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className={`inline-flex items-center gap-3 px-6 py-2 border-r border-white/5
                                   transition-all duration-300 cursor-pointer hover:bg-white/5
                                   ${flashingId === item.id ? 'bg-white/10' : ''}`}
                    >
                        <span className={`text-[10px] font-bold uppercase ${platformColors[item.platform] || 'text-gray-400'}`}>
                            {item.platform}
                        </span>
                        <span className="font-medium text-white text-sm">{item.symbol}</span>
                        <span className={`font-mono text-sm ${flashingId === item.id ? 'animate-pulse' : ''}`}>
                            ${item.price.toFixed(2)}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-medium
                                        ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.change >= 0 ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>

            {/* Gradient fade edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />

            {/* Inline keyframes */}
            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
