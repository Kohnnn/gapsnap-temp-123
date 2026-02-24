'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import GreeksRadar from '@/components/GreeksRadar';
import AnimatedNumber from '@/components/AnimatedNumber';
import { ChevronLeft, Activity, TrendingUp, Clock, Gauge, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
    // Position parameters
    const [price, setPrice] = useState(65);
    const [daysToExpiry, setDaysToExpiry] = useState(30);
    const [volatilityInput, setVolatilityInput] = useState(50);
    const [positionSize, setPositionSize] = useState(1000);

    // Calculate Greeks (simplified model)
    const greeks = useMemo(() => {
        const p = price / 100;
        const T = daysToExpiry / 365;
        const sigma = volatilityInput / 100;
        const sqrtT = Math.sqrt(T);

        // Delta: Price sensitivity
        const delta = p * (1 - p) * 4 / (sigma * sqrtT + 0.001);
        const normalizedDelta = Math.min(1, delta);

        // Gamma: Rate of delta change
        const gamma = 4 * (1 - 2 * p) / (sigma * sqrtT + 0.001);
        const normalizedGamma = Math.min(1, Math.abs(gamma) / 10);

        // Theta: Time decay (daily)
        const theta = -Math.abs(p - 0.5) * sigma / (2 * sqrtT + 0.001) / 365;

        // Vega: Volatility sensitivity
        const vega = p * (1 - p) * sqrtT;

        // Rho: Opportunity cost
        const rho = -T * p * positionSize * 0.05;

        return {
            delta: normalizedDelta,
            gamma: normalizedGamma,
            theta,
            vega,
            rho: rho / positionSize,
        };
    }, [price, daysToExpiry, volatilityInput, positionSize]);

    // Greek cards data
    const greekCards = [
        {
            symbol: 'Δ',
            name: 'Delta',
            value: greeks.delta,
            description: 'Probability sensitivity',
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/30',
        },
        {
            symbol: 'Γ',
            name: 'Gamma',
            value: greeks.gamma,
            description: 'Delta acceleration',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30',
        },
        {
            symbol: 'Θ',
            name: 'Theta',
            value: greeks.theta * positionSize,
            description: 'Daily time decay',
            color: 'text-pink-400',
            bgColor: 'bg-pink-500/10',
            borderColor: 'border-pink-500/30',
            isCurrency: true,
        },
        {
            symbol: 'ν',
            name: 'Vega',
            value: greeks.vega,
            description: 'Volatility sensitivity',
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/30',
        },
        {
            symbol: 'ρ',
            name: 'Rho',
            value: greeks.rho * 100,
            description: 'Opportunity cost',
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/30',
            isPercent: true,
        },
    ];

    // Implied volatility surface data (mock)
    const volSurface = useMemo(() => {
        const strikes = [30, 40, 50, 60, 70, 80, 90];
        const expiries = [7, 14, 30, 60, 90];

        return expiries.map(exp => ({
            expiry: exp,
            vols: strikes.map(strike => {
                // Simple smile approximation
                const atm = volatilityInput;
                const skew = (strike - 50) * 0.3;
                const term = Math.sqrt(30 / exp) * 5;
                return Math.max(10, atm + skew + term + (Math.random() * 5 - 2.5));
            }),
        }));
    }, [volatilityInput]);

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="gradient-orb gradient-orb-purple w-96 h-96 -top-48 -right-48 animate-orb" />
                <div className="gradient-orb gradient-orb-cyan w-72 h-72 bottom-20 -left-36 animate-orb" style={{ animationDelay: '-10s' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-black/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-400 hover:text-white transition">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Greeks Analytics
                        </span>
                    </div>
                    <nav className="flex gap-6 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white transition">Dashboard</Link>
                        <Link href="/simulator" className="hover:text-white transition">Simulator</Link>
                        <Link href="/thesis" className="hover:text-white transition">Thesis</Link>
                    </nav>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left - Controls */}
                    <div className="space-y-6">
                        <div className="glass-premium rounded-xl p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
                                <Activity className="w-5 h-5 text-purple-400" />
                                Position Parameters
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Market Price</span>
                                        <span className="text-white font-mono">${(price / 100).toFixed(2)}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="95"
                                        value={price}
                                        onChange={(e) => setPrice(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>5%</span>
                                        <span className="text-cyan-400">Implied: {price}%</span>
                                        <span>95%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Days to Expiry</span>
                                        <span className="text-white font-mono">{daysToExpiry}d</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="365"
                                        value={daysToExpiry}
                                        onChange={(e) => setDaysToExpiry(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Implied Volatility</span>
                                        <span className="text-amber-400 font-mono">{volatilityInput}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="150"
                                        value={volatilityInput}
                                        onChange={(e) => setVolatilityInput(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Position Size</span>
                                        <span className="text-white font-mono">${positionSize.toLocaleString()}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="10000"
                                        step="100"
                                        value={positionSize}
                                        onChange={(e) => setPositionSize(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="glass-premium rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                Position Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Contracts</span>
                                    <span className="text-white font-mono">
                                        {Math.floor(positionSize / (price / 100 * 100))}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Max Profit</span>
                                    <span className="text-emerald-400 font-mono">
                                        ${(positionSize * (1 - price / 100)).toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Max Loss</span>
                                    <span className="text-red-400 font-mono">
                                        -${(positionSize * price / 100).toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Breakeven</span>
                                    <span className="text-white font-mono">{price}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle - Radar Chart */}
                    <div className="flex flex-col items-center">
                        <div className="glass-premium rounded-xl p-6 w-full">
                            <h3 className="text-center text-lg font-semibold text-white mb-4">
                                Greeks Profile
                            </h3>
                            <div className="flex justify-center">
                                <GreeksRadar data={greeks} size={320} />
                            </div>
                        </div>
                    </div>

                    {/* Right - Greek Cards */}
                    <div className="space-y-4">
                        {greekCards.map((card) => (
                            <div
                                key={card.name}
                                className={`glass-premium rounded-xl p-4 border ${card.borderColor} hover:scale-[1.02] transition-transform`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                                        <span className={`text-2xl font-serif ${card.color}`}>{card.symbol}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-white">{card.name}</span>
                                            <span className={`text-xl font-mono ${card.color}`}>
                                                {card.isCurrency && (card.value < 0 ? '-$' : '$')}
                                                {card.isCurrency
                                                    ? Math.abs(card.value).toFixed(2)
                                                    : card.isPercent
                                                        ? `${card.value.toFixed(2)}%`
                                                        : card.value.toFixed(3)
                                                }
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">{card.description}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Volatility Surface */}
                <div className="mt-8 glass-premium rounded-xl p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
                        <Gauge className="w-5 h-5 text-amber-400" />
                        Implied Volatility Surface
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400">
                                    <th className="text-left p-2">DTE \ Strike</th>
                                    {[30, 40, 50, 60, 70, 80, 90].map(strike => (
                                        <th key={strike} className="text-center p-2">{strike}%</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {volSurface.map(row => (
                                    <tr key={row.expiry} className="border-t border-white/5">
                                        <td className="p-2 text-gray-400 font-mono">{row.expiry}d</td>
                                        {row.vols.map((vol, i) => {
                                            const intensity = Math.min(1, (vol - 20) / 80);
                                            const hue = 200 - intensity * 120; // Cyan to red
                                            return (
                                                <td
                                                    key={i}
                                                    className="text-center p-2 font-mono text-xs heatmap-cell"
                                                    style={{
                                                        backgroundColor: `hsla(${hue}, 70%, 50%, ${0.2 + intensity * 0.3})`,
                                                        color: intensity > 0.5 ? '#fff' : '#ccc',
                                                    }}
                                                >
                                                    {vol.toFixed(1)}%
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsla(200, 70%, 50%, 0.3)' }} />
                            <span>Low IV</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsla(140, 70%, 50%, 0.4)' }} />
                            <span>Medium</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsla(80, 70%, 50%, 0.5)' }} />
                            <span>High IV</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
