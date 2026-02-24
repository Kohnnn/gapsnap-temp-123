'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import MonteCarloChart from '@/components/MonteCarloChart';
import AnimatedNumber, { AnimatedCurrency, AnimatedPercent } from '@/components/AnimatedNumber';
import { Sliders, TrendingUp, Target, Shield, ChevronLeft } from 'lucide-react';

export default function SimulatorPage() {
    // Simulation parameters
    const [initialCapital, setInitialCapital] = useState(10000);
    const [timeHorizon, setTimeHorizon] = useState(12); // months
    const [expectedReturn, setExpectedReturn] = useState(15); // annual %
    const [volatility, setVolatility] = useState(30); // annual %
    const [numPaths, setNumPaths] = useState(100);

    // Kelly parameters
    const [winRate, setWinRate] = useState(55);
    const [avgWin, setAvgWin] = useState(1.5);
    const [avgLoss, setAvgLoss] = useState(1);

    // Calculate Kelly fraction
    const kellyFraction = useMemo(() => {
        const p = winRate / 100;
        const b = avgWin / avgLoss;
        const kelly = (p * b - (1 - p)) / b;
        return Math.max(0, kelly);
    }, [winRate, avgWin, avgLoss]);

    // Risk metrics
    const metrics = useMemo(() => {
        const annualReturn = expectedReturn / 100;
        const annualVol = volatility / 100;

        // Expected final value
        const expectedFinal = initialCapital * Math.exp(annualReturn * (timeHorizon / 12));

        // VaR (95% confidence)
        const zScore = 1.645;
        const varDaily = initialCapital * annualVol / Math.sqrt(252) * zScore;
        const varMonthly = varDaily * Math.sqrt(21);

        // Sharpe ratio (assuming 5% risk-free rate)
        const sharpe = (annualReturn - 0.05) / annualVol;

        // Max drawdown estimate (approximation)
        const maxDrawdown = annualVol * 2.5;

        return {
            expectedFinal,
            varMonthly,
            sharpe,
            maxDrawdown,
        };
    }, [initialCapital, expectedReturn, volatility, timeHorizon]);

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="gradient-orb gradient-orb-cyan w-96 h-96 -top-48 -left-48 animate-orb" />
                <div className="gradient-orb gradient-orb-purple w-80 h-80 top-1/2 -right-40 animate-orb" style={{ animationDelay: '-7s' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-black/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-400 hover:text-white transition">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Portfolio Simulator
                        </span>
                    </div>
                    <nav className="flex gap-6 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white transition">Dashboard</Link>
                        <Link href="/analytics" className="hover:text-white transition">Analytics</Link>
                        <Link href="/thesis" className="hover:text-white transition">Thesis</Link>
                    </nav>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Panel - Controls */}
                    <div className="space-y-6">
                        {/* Capital & Time */}
                        <div className="glass-premium rounded-xl p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
                                <Sliders className="w-5 h-5 text-cyan-400" />
                                Simulation Parameters
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Initial Capital</span>
                                        <span className="text-white font-mono">${initialCapital.toLocaleString()}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="100000"
                                        step="1000"
                                        value={initialCapital}
                                        onChange={(e) => setInitialCapital(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Time Horizon</span>
                                        <span className="text-white font-mono">{timeHorizon} months</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="36"
                                        value={timeHorizon}
                                        onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Expected Annual Return</span>
                                        <span className="text-emerald-400 font-mono">{expectedReturn}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="-20"
                                        max="100"
                                        value={expectedReturn}
                                        onChange={(e) => setExpectedReturn(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Volatility (σ)</span>
                                        <span className="text-amber-400 font-mono">{volatility}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="100"
                                        value={volatility}
                                        onChange={(e) => setVolatility(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Simulation Paths</span>
                                        <span className="text-white font-mono">{numPaths}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="500"
                                        step="10"
                                        value={numPaths}
                                        onChange={(e) => setNumPaths(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kelly Calculator */}
                        <div className="glass-premium rounded-xl p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
                                <Target className="w-5 h-5 text-purple-400" />
                                Kelly Criterion
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Win Rate</span>
                                        <span className="text-white font-mono">{winRate}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="99"
                                        value={winRate}
                                        onChange={(e) => setWinRate(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Avg Win / Avg Loss</span>
                                        <span className="text-white font-mono">{avgWin.toFixed(1)}x</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="5"
                                        step="0.1"
                                        value={avgWin}
                                        onChange={(e) => setAvgWin(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div className="pt-4 border-t border-white/5">
                                    <div className="text-sm text-gray-400 mb-2">Optimal Bet Size</div>
                                    <div className={`text-3xl font-bold ${kellyFraction > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        <AnimatedPercent value={kellyFraction * 100} decimals={1} />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Half Kelly: {(kellyFraction * 50).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Charts & Metrics */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Monte Carlo Chart */}
                        <MonteCarloChart
                            paths={numPaths}
                            steps={timeHorizon * 4} // Weekly steps
                            initialValue={initialCapital}
                            drift={expectedReturn / 100}
                            volatility={volatility / 100}
                        />

                        {/* Risk Metrics */}
                        <div className="glass-premium rounded-xl p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                Risk Analysis
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center p-4 rounded-lg bg-white/5">
                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Expected Value</div>
                                    <div className="text-2xl font-bold text-white">
                                        <AnimatedCurrency value={metrics.expectedFinal} decimals={0} />
                                    </div>
                                    <div className={`text-xs mt-1 ${metrics.expectedFinal > initialCapital ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {metrics.expectedFinal > initialCapital ? '+' : ''}
                                        {(((metrics.expectedFinal / initialCapital) - 1) * 100).toFixed(1)}%
                                    </div>
                                </div>

                                <div className="text-center p-4 rounded-lg bg-white/5">
                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Monthly VaR (95%)</div>
                                    <div className="text-2xl font-bold text-red-400">
                                        -<AnimatedCurrency value={metrics.varMonthly} decimals={0} />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {((metrics.varMonthly / initialCapital) * 100).toFixed(1)}% of capital
                                    </div>
                                </div>

                                <div className="text-center p-4 rounded-lg bg-white/5">
                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Sharpe Ratio</div>
                                    <div className={`text-2xl font-bold ${metrics.sharpe > 1 ? 'text-emerald-400' : metrics.sharpe > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                                        <AnimatedNumber value={metrics.sharpe} decimals={2} />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {metrics.sharpe > 2 ? 'Excellent' : metrics.sharpe > 1 ? 'Good' : metrics.sharpe > 0 ? 'Fair' : 'Poor'}
                                    </div>
                                </div>

                                <div className="text-center p-4 rounded-lg bg-white/5">
                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Est. Max Drawdown</div>
                                    <div className="text-2xl font-bold text-amber-400">
                                        -<AnimatedPercent value={metrics.maxDrawdown * 100} decimals={1} />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Historical estimate
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="w-5 h-5 text-cyan-400 mt-0.5" />
                                <div className="text-sm text-gray-400">
                                    <strong className="text-white">Model:</strong> Geometric Brownian Motion (GBM) with
                                    daily rebalancing. Paths are generated using Monte Carlo simulation with {numPaths} scenarios.
                                    The Kelly Criterion suggests optimal bet sizing based on edge and win rate.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
