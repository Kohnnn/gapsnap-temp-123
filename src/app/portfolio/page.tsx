'use client';

import React, { useMemo } from 'react';
import PortfolioTreemap from '@/components/PortfolioTreemap';
import PositionsTable from '@/components/PositionsTable';
import WaterfallChart from '@/components/WaterfallChart';
import VolatilitySurface3D from '@/components/VolatilitySurface3D';
import { RiskPanel } from '@/components/RiskPanel';
import { Header } from '@/components/Header';
import { ConceptCard } from '@/components/ConceptCard';

// Mock Data
const TREEMAP_DATA = [
    {
        name: 'Crypto',
        value: 4500,
        change: 12.5,
        children: [
            { name: 'BTC/USD', value: 2500, change: 15.2 },
            { name: 'ETH/USD', value: 2000, change: 8.4 },
        ]
    },
    {
        name: 'Politics',
        value: 3200,
        change: -5.2,
        children: [
            { name: 'US Election', value: 2200, change: -8.1 },
            { name: 'UK Policy', value: 1000, change: 1.2 },
        ]
    },
    {
        name: 'Economics',
        value: 1800,
        change: 3.4,
    }
];

const POSITIONS = [
    {
        id: '1',
        market: 'Will BTC hit $100k in 2026?',
        description: 'Predict whether Bitcoin reaches $100,000 anytime in 2026.',
        side: 'YES' as const,
        size: 500,
        avgPrice: 0.45,
        currentPrice: 0.58,
        pnl: 65,
        pnlPercent: 28.8,
        platform: 'Polymarket' as const,
    },
    {
        id: '2',
        market: 'Fed Interest Rate Cut in March?',
        description: 'Market on whether the Fed will lower rates by 25bps.',
        side: 'NO' as const,
        size: 1000,
        avgPrice: 0.62,
        currentPrice: 0.55,
        pnl: 70,
        pnlPercent: 11.2,
        platform: 'Kalshi' as const,
    }
];

const WATERFALL_DATA = [
    { label: 'Start Balance', value: 10000, type: 'start' as const },
    { label: 'Realized P&L', value: 1250, type: 'positive' as const },
    { label: 'Unrealized P&L', value: 450, type: 'positive' as const },
    { label: 'Fees Paid', value: -120, type: 'negative' as const },
    { label: 'Withdrawals', value: -2000, type: 'negative' as const },
    { label: 'Total Equity', value: 9580, type: 'total' as const },
];

const VOL_DATA = {
    strikes: [80, 90, 100, 110, 120],
    expiries: [7, 14, 30, 60, 90],
    volatilities: [
        [45, 42, 40, 42, 45],
        [40, 38, 35, 38, 40],
        [38, 35, 32, 35, 38],
        [42, 40, 38, 40, 42],
        [48, 45, 42, 45, 48],
    ]
};

export default function PortfolioPage() {
    return (
        <main className="min-h-screen bg-background text-foreground pb-20">
            <Header />

            <div className="container mx-auto px-6 py-8 flex flex-col gap-8">
                {/* Page Header */}
                <div className="flex justify-between items-end animate-slide-in-down">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tighter gradient-text text-glow">Portfolio Management</h1>
                        <p className="text-white/40 mt-1 font-medium">Real-time exposure and performance tracking</p>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-right">
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Total Equity</p>
                            <p className="text-3xl font-mono font-bold text-primary">$9,580.00</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">24h Change</p>
                            <p className="text-3xl font-mono font-bold text-success">+$450.20 (4.2%)</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left Column (8 units) */}
                    <div className="xl:col-span-8 flex flex-col gap-6">
                        {/* Summary Visualization */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="animate-slide-in-left stagger-1">
                                <PortfolioTreemap data={TREEMAP_DATA} height={350} className="glass-premium" />
                            </div>
                            <div className="animate-slide-in-right stagger-1">
                                <VolatilitySurface3D data={VOL_DATA} className="h-[350px] glass-premium" />
                            </div>
                        </div>

                        {/* Positions Table */}
                        <div className="animate-slide-in-up stagger-2">
                            <PositionsTable positions={POSITIONS} className="glass-premium" />
                        </div>
                    </div>

                    {/* Right Column (4 units) */}
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        <div className="animate-slide-in-right stagger-3">
                            <WaterfallChart data={WATERFALL_DATA} className="glass-premium" />
                        </div>
                        <div className="animate-slide-in-right stagger-4">
                            <RiskPanel />
                        </div>
                        <div className="animate-slide-in-right stagger-5">
                            <ConceptCard
                                title="Modern Kelly Strategy"
                                description="The Kelly Criterion determines optimal position size to maximize geometric growth of capital over time, adjusting for both edge and odds."
                                formula="f* = (bp - q) / b"
                                concept="Professional risk management requires balancing 'Expected Value' against 'Variance'. Over-allocation leads to ruin, while under-allocation leaves latent alpha on the table."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
