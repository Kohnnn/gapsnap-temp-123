'use client';

import React, { useMemo, useState } from 'react';

interface OrderBookLevel {
    price: number;
    size: number;
    cumulative: number;
}

interface OrderBookDepthProps {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    midPrice: number;
    className?: string;
}

export default function OrderBookDepth({ bids, asks, midPrice, className }: OrderBookDepthProps) {
    const [hoveredLevel, setHoveredLevel] = useState<{ price: number; size: number; side: 'bid' | 'ask' } | null>(null);

    const { width, height, padding } = { width: 600, height: 300, padding: 40 };

    const maxCumulative = useMemo(() => {
        const bidMax = bids.length > 0 ? bids[bids.length - 1].cumulative : 0;
        const askMax = asks.length > 0 ? asks[asks.length - 1].cumulative : 0;
        return Math.max(bidMax, askMax, 1) * 1.1;
    }, [bids, asks]);

    const minPrice = bids.length > 0 ? bids[bids.length - 1].price : midPrice * 0.95;
    const maxPrice = asks.length > 0 ? asks[asks.length - 1].price : midPrice * 1.05;
    const priceRange = maxPrice - minPrice || 1;

    const scaleX = useMemo(() => (price: number) => padding + ((price - minPrice) / priceRange) * (width - 2 * padding), [minPrice, priceRange, padding, width]);
    const scaleY = useMemo(() => (cumulative: number) => height - padding - (cumulative / maxCumulative) * (height - 2 * padding), [maxCumulative, padding, height]);

    const bidPath = useMemo(() => {
        if (bids.length === 0) return '';
        // Start from midPrice at bottom
        let d = `M ${scaleX(midPrice)} ${scaleY(0)}`;
        // Sort bids descending (highest price first) for the path
        const sortedBids = [...bids].sort((a, b) => b.price - a.price);
        sortedBids.forEach((b) => {
            d += ` L ${scaleX(b.price)} ${scaleY(b.cumulative)}`;
        });
        d += ` L ${scaleX(minPrice)} ${scaleY(bids[bids.length - 1].cumulative)}`;
        d += ` L ${scaleX(minPrice)} ${scaleY(0)} Z`;
        return d;
    }, [bids, midPrice, minPrice, scaleX, scaleY]);

    const askPath = useMemo(() => {
        if (asks.length === 0) return '';
        // Start from midPrice at bottom
        let d = `M ${scaleX(midPrice)} ${scaleY(0)}`;
        asks.forEach((a) => {
            d += ` L ${scaleX(a.price)} ${scaleY(a.cumulative)}`;
        });
        d += ` L ${scaleX(maxPrice)} ${scaleY(asks[asks.length - 1].cumulative)}`;
        d += ` L ${scaleX(maxPrice)} ${scaleY(0)} Z`;
        return d;
    }, [asks, midPrice, maxPrice, scaleX, scaleY]);

    return (
        <div className={`glass-premium p-4 flex flex-col gap-4 ${className} noise`}>
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-bold text-white tracking-tight">Order Book Depth</h3>
                    <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest">Aggregate Market Liquidity</p>
                </div>
                <div className="text-[10px] text-white/50 flex gap-4 font-bold tracking-wider">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></span> Bids</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]"></span> Asks</span>
                </div>
            </div>

            <div className="relative w-full aspect-[2.5/1] bg-black/40 rounded-xl overflow-hidden border border-white/10 group/depth">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                        <line
                            key={`grid-${p}`}
                            x1={padding}
                            y1={scaleY(p * maxCumulative)}
                            x2={width - padding}
                            y2={scaleY(p * maxCumulative)}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Defrost Gradients */}
                    <defs>
                        <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Bid Area */}
                    <path d={bidPath} fill="url(#bidGradient)" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />

                    {/* Ask Area */}
                    <path d={askPath} fill="url(#askGradient)" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />

                    {/* Mid Price Line */}
                    <line
                        x1={scaleX(midPrice)}
                        y1={padding}
                        x2={scaleX(midPrice)}
                        y2={height - padding}
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        className="animate-pulse"
                    />

                    {/* Prices on X Axis */}
                    <text x={scaleX(minPrice)} y={height - 15} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="start">
                        {minPrice.toFixed(2)}
                    </text>
                    <text x={scaleX(midPrice)} y={height - 15} fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="middle">
                        {midPrice.toFixed(2)}
                    </text>
                    <text x={scaleX(maxPrice)} y={height - 15} fill="rgba(255,255,255,0.4)" fontSize="10" textAnchor="end">
                        {maxPrice.toFixed(2)}
                    </text>
                </svg>

                {/* Hover Interaction Overlay */}
                <div className="absolute inset-0 flex">
                    <div
                        className="h-full"
                        style={{ width: `${((scaleX(midPrice) - padding) / (width - 2 * padding)) * 100}%`, marginLeft: `${(padding / width) * 100}%` }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = (e.clientX - rect.left) / rect.width;
                            const targetPrice = midPrice - x * (midPrice - minPrice);
                            const closest = bids.reduce((prev, curr) =>
                                Math.abs(curr.price - targetPrice) < Math.abs(prev.price - targetPrice) ? curr : prev
                                , bids[0]);
                            if (closest) setHoveredLevel({ ...closest, side: 'bid' });
                        }}
                        onMouseLeave={() => setHoveredLevel(null)}
                    />
                    <div
                        className="h-full flex-1"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = (e.clientX - rect.left) / rect.width;
                            const targetPrice = midPrice + x * (maxPrice - midPrice);
                            const closest = asks.reduce((prev, curr) =>
                                Math.abs(curr.price - targetPrice) < Math.abs(prev.price - targetPrice) ? curr : prev
                                , asks[0]);
                            if (closest) setHoveredLevel({ ...closest, side: 'ask' });
                        }}
                        onMouseLeave={() => setHoveredLevel(null)}
                    />
                </div>

                {hoveredLevel && (
                    <div
                        className="absolute pointer-events-none p-3 rounded-lg bg-black/90 border border-white/20 backdrop-blur-xl text-[10px] z-20 shadow-2xl animate-in zoom-in-95 duration-200"
                        style={{
                            left: `${scaleX(hoveredLevel.price)}px`,
                            top: '15%',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <div className={`font-bold mb-1 tracking-wider ${hoveredLevel.side === 'bid' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                            {hoveredLevel.side.toUpperCase()} @ ${hoveredLevel.price.toFixed(4)}
                        </div>
                        <div className="text-white/80 font-mono">Size: {hoveredLevel.size.toLocaleString()}</div>
                        <div className="text-white/40 font-mono mt-1 text-[9px]">Value: ${(hoveredLevel.size * hoveredLevel.price).toLocaleString()}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
