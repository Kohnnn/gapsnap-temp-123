"use client"

import { useEffect, useState } from 'react';
import { Header, StatCard } from '@/components/Header';
import { MarketCard } from '@/components/MarketCard';
import { ArbOpportunity } from '@/components/ArbOpportunity';
import { PnLChart } from '@/components/PnLChart';
import { RiskPanel } from '@/components/RiskPanel';
import ParticleBackground from '@/components/ParticleBackground';
import PriceTicker from '@/components/PriceTicker';
import { getMarkets, getArbitrageOpportunities, getRiskMetrics } from '@/lib/api';
import { Wallet, BarChart2, Zap, ShieldCheck, Activity } from 'lucide-react';

export default function DashboardClient() {
    const [markets, setMarkets] = useState<any[]>([]);
    const [arbitrage, setArbitrage] = useState<any[]>([]);
    const [risk, setRisk] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showParticles, setShowParticles] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [m, a, r] = await Promise.all([
                getMarkets(),
                getArbitrageOpportunities(),
                getRiskMetrics()
            ]);
            setMarkets(m);
            setArbitrage(a);
            setRisk(r);
            setLoading(false);
        }

        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Initializing Analysis Engine...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 relative">
            {/* Visual elements removed for professional clarity */}

            <div className="relative z-10">
                <Header />

                {/* Price Ticker */}
                <PriceTicker />

                <main className="container mx-auto px-6 py-8">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            label="Current Equity"
                            value="$12,450.80"
                            icon={Wallet}
                            trend={{ value: 2.4, isPositive: true }}
                        />
                        <StatCard
                            label="Daily P&L"
                            value="+$450.20"
                            icon={BarChart2}
                            trend={{ value: 0.8, isPositive: true }}
                        />
                        <StatCard
                            label="Detected Alpha"
                            value={arbitrage.length}
                            icon={Activity}
                        />
                        <StatCard
                            label="System Stability"
                            value="Optimal"
                            icon={ShieldCheck}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Performance Chart */}
                        <div className="lg:col-span-2 glass rounded-xl p-6 border border-white/5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-base font-bold tracking-tight">Performance Overview</h2>
                                <div className="flex gap-2">
                                    {['1H', '1D', '1W', '1M'].map((t) => (
                                        <button key={t} className={cn(
                                            "px-3 py-1 rounded-md text-[10px] font-bold transition-colors",
                                            t === '1D' ? "bg-blue-500 text-white" : "text-zinc-500 hover:text-zinc-300 bg-zinc-800/50"
                                        )}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <PnLChart data={[]} />
                        </div>

                        {/* Risk Panel */}
                        <div className="lg:col-span-1">
                            <RiskPanel />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Arbitrage List */}
                        <div className="lg:col-span-1 border-r border-white/5 pr-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-base font-bold tracking-tight">Active Opportunities</h2>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-2 py-1 rounded">
                                    Scanning All
                                </span>
                            </div>
                            <div className="flex flex-col gap-4">
                                {arbitrage.map((arb, i) => (
                                    <ArbOpportunity key={i} {...arb} />
                                ))}
                                {arbitrage.length === 0 && (
                                    <div className="p-8 text-center glass rounded-xl border border-dashed border-zinc-800">
                                        <p className="text-zinc-600 text-sm font-medium">No opportunities detected</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Markets Grid */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-base font-bold tracking-tight">Active Market Analysis</h2>
                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <button className="text-white">Universe</button>
                                    <button className="hover:text-slate-300">Polymarket</button>
                                    <button className="hover:text-slate-300">Kalshi</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {markets.map((market, i) => (
                                    <MarketCard
                                        key={i}
                                        platform={market.platform}
                                        question={market.question}
                                        yesPrice={market.outcomes.find((o: any) => o.name === 'yes')?.price || 0}
                                        noPrice={market.outcomes.find((o: any) => o.name === 'no')?.price || 0}
                                        volume24h={market.volume_24h || 0}
                                        spread={market.spread || 0}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

import { cn } from '@/lib/utils';

