'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ThesisPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-white">
                        GapSnap <span className="text-primary">Quant</span>
                    </Link>
                    <nav className="flex gap-6 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white transition">Dashboard</Link>
                        <Link href="/thesis" className="text-white">Thesis</Link>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="container mx-auto px-6 py-16">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                    Quantitative <span className="text-primary">Investment Thesis</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mb-8">
                    Systematic prediction market analysis using objective probability modeling,
                    risk-adjusted allocation strategies, and multi-platform arbitrage.
                </p>
                <div className="flex gap-4">
                    <a href="#calculator" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition">
                        Try Calculator →
                    </a>
                    <a href="#greeks" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition">
                        Learn Greeks
                    </a>
                </div>
            </section>

            {/* Key Metrics */}
            <section className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard label="Expected Returns" value="15-50%" sublabel="Annual" />
                    <MetricCard label="Pure Arbitrage" value="100%" sublabel="Win Rate" />
                    <MetricCard label="Cross-Platform" value="2-6%" sublabel="Price Discrepancy" />
                    <MetricCard label="Market Volume" value="$3.5B+" sublabel="Annual" />
                </div>
            </section>

            {/* Expected Value Section */}
            <section className="container mx-auto px-6 py-16" id="ev">
                <h2 className="text-3xl font-bold text-white mb-8">Expected Value</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">The Core Formula</h3>
                        <div className="bg-black/40 rounded-lg p-6 font-mono text-center text-2xl text-white mb-4">
                            EV = π - p
                        </div>
                        <ul className="text-slate-400 space-y-2 text-sm">
                            <li>• <strong className="text-white">π</strong> = Model-derived probability</li>
                            <li>• <strong className="text-white">p</strong> = Current market implied probability</li>
                            <li>• <strong className="text-white">EV &gt; 0</strong> = Positive expectation trade</li>
                        </ul>
                    </div>
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-purple-400 mb-4">Example</h3>
                        <div className="space-y-4 text-gray-300">
                            <p>You believe Bitcoin has a <strong className="text-white">70%</strong> chance of hitting $100k.</p>
                            <p>Market price: <strong className="text-white">$0.55</strong> (55% implied)</p>
                            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mt-4">
                                <div className="font-mono">EV = 0.70 - 0.55 = <span className="text-green-400 text-xl">+15%</span></div>
                                <p className="text-sm text-gray-400 mt-2">Expected profit: $15 per $100 risked</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kelly Calculator */}
            <section className="container mx-auto px-6 py-16" id="calculator">
                <h2 className="text-3xl font-bold text-white mb-8">Kelly Criterion Calculator</h2>
                <KellyCalculator />
            </section>

            {/* Greeks Section */}
            <section className="container mx-auto px-6 py-16" id="greeks">
                <h2 className="text-3xl font-bold text-white mb-8">Prediction Market Greeks</h2>
                <p className="text-gray-400 mb-8 max-w-2xl">
                    Adapted from traditional options, Greeks measure sensitivity to various factors.
                </p>
                <div className="grid md:grid-cols-5 gap-4">
                    <GreekCard
                        symbol="Δ"
                        name="Delta"
                        desc="Probability sensitivity"
                        formula="∂V/∂π"
                    />
                    <GreekCard
                        symbol="Γ"
                        name="Gamma"
                        desc="Rate of delta change"
                        formula="∂²V/∂π²"
                    />
                    <GreekCard
                        symbol="Θ"
                        name="Theta"
                        desc="Time decay"
                        formula="∂V/∂t"
                    />
                    <GreekCard
                        symbol="ν"
                        name="Vega"
                        desc="Volatility sensitivity"
                        formula="∂V/∂σ"
                    />
                    <GreekCard
                        symbol="ρ"
                        name="Rho"
                        desc="Opportunity cost"
                        formula="∂V/∂r"
                    />
                </div>
            </section>

            {/* Arbitrage Section */}
            <section className="container mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-white mb-8">Arbitrage Engine</h2>
                <div className="glass-card p-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Single Market</h3>
                            <p className="text-gray-400 text-sm mb-4">If YES + NO &lt; $1.00</p>
                            <div className="bg-black/40 rounded p-4 font-mono text-sm">
                                YES = $0.48<br />
                                NO = $0.49<br />
                                <span className="text-green-400">Profit = $0.03</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-purple-400 mb-4">Cross-Platform</h3>
                            <p className="text-gray-400 text-sm mb-4">Same event, different prices</p>
                            <div className="bg-black/40 rounded p-4 font-mono text-sm">
                                Polymarket: YES $0.55<br />
                                Kalshi: NO $0.42<br />
                                <span className="text-green-400">Profit = $0.03</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-pink-400 mb-4">Combinatorial</h3>
                            <p className="text-gray-400 text-sm mb-4">Mutually exclusive outcomes</p>
                            <div className="bg-black/40 rounded p-4 font-mono text-sm">
                                Candidate A: $0.35<br />
                                Candidate B: $0.30<br />
                                Candidate C: $0.32<br />
                                <span className="text-green-400">Σ = $0.97 → 3%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
                GapSnap © 2026 | Built with mathematical precision
            </footer>
        </div>
    );
}

// Components

function MetricCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
    return (
        <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-400">{label}</div>
            <div className="text-xs text-gray-500">{sublabel}</div>
        </div>
    );
}

function GreekCard({ symbol, name, desc, formula }: { symbol: string; name: string; desc: string; formula: string }) {
    return (
        <div className="glass-card p-4 text-center hover:border-cyan-500/50 transition-all cursor-pointer">
            <div className="text-4xl font-serif text-cyan-400 mb-2">{symbol}</div>
            <div className="font-semibold text-white">{name}</div>
            <div className="text-xs text-gray-400 mt-1">{desc}</div>
            <div className="text-xs font-mono text-gray-500 mt-2">{formula}</div>
        </div>
    );
}

function KellyCalculator() {
    const [prob, setProb] = useState(60);
    const [price, setPrice] = useState(50);
    const [bankroll, setBankroll] = useState(10000);

    const probDecimal = prob / 100;
    const priceDecimal = price / 100;
    const odds = priceDecimal > 0 ? (1 / priceDecimal) - 1 : 0;
    const edge = probDecimal - priceDecimal;
    const kelly = odds > 0 ? ((probDecimal * odds) - (1 - probDecimal)) / odds : 0;
    const halfKelly = kelly * 0.5;
    const betSize = Math.max(0, bankroll * halfKelly);

    return (
        <div className="glass-card p-8 max-w-2xl">
            <div className="space-y-6">
                {/* Probability Slider */}
                <div>
                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Your Probability Estimate</span>
                        <span className="text-white font-mono">{prob}%</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="99"
                        value={prob}
                        onChange={(e) => setProb(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                </div>

                {/* Price Slider */}
                <div>
                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Market Price</span>
                        <span className="text-white font-mono">${(price / 100).toFixed(2)}</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="99"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>

                {/* Bankroll */}
                <div>
                    <label className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Bankroll</span>
                        <span className="text-white font-mono">${bankroll.toLocaleString()}</span>
                    </label>
                    <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={bankroll}
                        onChange={(e) => setBankroll(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                    <ResultBox
                        label="Edge"
                        value={`${(edge * 100).toFixed(1)}%`}
                        positive={edge > 0}
                    />
                    <ResultBox
                        label="Full Kelly"
                        value={`${(kelly * 100).toFixed(1)}%`}
                        positive={kelly > 0}
                    />
                    <ResultBox
                        label="Half Kelly"
                        value={`${(halfKelly * 100).toFixed(1)}%`}
                        positive={halfKelly > 0}
                    />
                    <ResultBox
                        label="Allocation"
                        value={`$${betSize.toFixed(0)}`}
                        positive={betSize > 0}
                        highlight
                    />
                </div>
            </div>
        </div>
    );
}

function ResultBox({ label, value, positive, highlight }: { label: string; value: string; positive: boolean; highlight?: boolean }) {
    return (
        <div className={`p-4 rounded-lg ${highlight ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' : 'bg-black/30'}`}>
            <div className="text-xs text-gray-400 mb-1">{label}</div>
            <div className={`text-xl font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
                {value}
            </div>
        </div>
    );
}
