'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    ChevronLeft, Search, Filter, Bell, Star, StarOff,
    TrendingUp, TrendingDown, Zap, AlertTriangle,
    RefreshCw, ExternalLink
} from 'lucide-react';

interface Market {
    id: string;
    question: string;
    platform: string;
    category: string;
    yesPrice: number;
    noPrice: number;
    change24h: number;
    volume24h: number;
    spread: number;
    daysToExpiry: number;
    isWatched: boolean;
    hasArbitrage: boolean;
    arbSpread?: number;
}

const PLATFORMS = ['All', 'Polymarket', 'Kalshi', 'Manifold', 'Metaculus'];
const CATEGORIES = ['All', 'Politics', 'Crypto', 'Finance', 'Sports', 'AI', 'Climate'];

const mockMarkets: Market[] = [
    { id: '1', question: 'Bitcoin > $100K by June 2026?', platform: 'Polymarket', category: 'Crypto', yesPrice: 0.68, noPrice: 0.34, change24h: 5.2, volume24h: 2450000, spread: 0.02, daysToExpiry: 165, isWatched: true, hasArbitrage: true, arbSpread: 0.03 },
    { id: '2', question: 'Fed Rate Cut in Q1 2026?', platform: 'Kalshi', category: 'Finance', yesPrice: 0.52, noPrice: 0.49, change24h: -2.1, volume24h: 890000, spread: 0.01, daysToExpiry: 75, isWatched: false, hasArbitrage: false },
    { id: '3', question: 'Trump wins 2028 election?', platform: 'Polymarket', category: 'Politics', yesPrice: 0.35, noPrice: 0.67, change24h: 8.5, volume24h: 5200000, spread: 0.02, daysToExpiry: 1020, isWatched: true, hasArbitrage: true, arbSpread: 0.04 },
    { id: '4', question: 'Ethereum > $5K by March 2026?', platform: 'Manifold', category: 'Crypto', yesPrice: 0.45, noPrice: 0.58, change24h: -1.8, volume24h: 320000, spread: 0.03, daysToExpiry: 60, isWatched: false, hasArbitrage: false },
    { id: '5', question: 'AGI by 2030?', platform: 'Metaculus', category: 'AI', yesPrice: 0.22, noPrice: 0.80, change24h: 0.5, volume24h: 150000, spread: 0.02, daysToExpiry: 1460, isWatched: false, hasArbitrage: false },
    { id: '6', question: 'S&P 500 +20% in 2026?', platform: 'Kalshi', category: 'Finance', yesPrice: 0.38, noPrice: 0.64, change24h: 3.2, volume24h: 720000, spread: 0.02, daysToExpiry: 350, isWatched: true, hasArbitrage: false },
    { id: '7', question: 'Ukraine peace deal in 2026?', platform: 'Polymarket', category: 'Politics', yesPrice: 0.33, noPrice: 0.69, change24h: 12.0, volume24h: 1800000, spread: 0.02, daysToExpiry: 350, isWatched: false, hasArbitrage: true, arbSpread: 0.05 },
    { id: '8', question: 'US Recession in 2026?', platform: 'Kalshi', category: 'Finance', yesPrice: 0.28, noPrice: 0.74, change24h: -4.2, volume24h: 980000, spread: 0.02, daysToExpiry: 350, isWatched: false, hasArbitrage: false },
    { id: '9', question: 'GPT-5 released by July 2026?', platform: 'Manifold', category: 'AI', yesPrice: 0.72, noPrice: 0.30, change24h: 2.8, volume24h: 280000, spread: 0.02, daysToExpiry: 180, isWatched: true, hasArbitrage: false },
    { id: '10', question: 'Chiefs win Super Bowl 2026?', platform: 'Kalshi', category: 'Sports', yesPrice: 0.15, noPrice: 0.87, change24h: -1.5, volume24h: 450000, spread: 0.02, daysToExpiry: 45, isWatched: false, hasArbitrage: false },
];

export default function ScannerPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlatform, setSelectedPlatform] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showArbOnly, setShowArbOnly] = useState(false);
    const [showWatchedOnly, setShowWatchedOnly] = useState(false);
    const [sortBy, setSortBy] = useState<'volume' | 'change' | 'spread' | 'expiry'>('volume');
    const [markets, setMarkets] = useState<Market[]>(mockMarkets);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Filter and sort markets
    const filteredMarkets = useMemo(() => {
        const result = markets.filter(m => {
            if (searchQuery && !m.question.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (selectedPlatform !== 'All' && m.platform !== selectedPlatform) return false;
            if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
            if (showArbOnly && !m.hasArbitrage) return false;
            if (showWatchedOnly && !m.isWatched) return false;
            return true;
        });

        result.sort((a, b) => {
            switch (sortBy) {
                case 'volume': return b.volume24h - a.volume24h;
                case 'change': return Math.abs(b.change24h) - Math.abs(a.change24h);
                case 'spread': return b.spread - a.spread;
                case 'expiry': return a.daysToExpiry - b.daysToExpiry;
                default: return 0;
            }
        });

        return result;
    }, [markets, searchQuery, selectedPlatform, selectedCategory, showArbOnly, showWatchedOnly, sortBy]);

    // Simulate price updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMarkets(prev => prev.map(m => ({
                ...m,
                yesPrice: Math.max(0.01, Math.min(0.99, m.yesPrice + (Math.random() - 0.5) * 0.02)),
                change24h: m.change24h + (Math.random() - 0.5) * 0.5,
            })));
            setLastUpdate(new Date());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setMarkets(mockMarkets.map(m => ({
                ...m,
                yesPrice: Math.max(0.01, Math.min(0.99, m.yesPrice + (Math.random() - 0.5) * 0.05)),
            })));
            setIsRefreshing(false);
            setLastUpdate(new Date());
        }, 1000);
    };

    const toggleWatch = (id: string) => {
        setMarkets(prev => prev.map(m =>
            m.id === id ? { ...m, isWatched: !m.isWatched } : m
        ));
    };

    const platformColors: Record<string, string> = {
        'Polymarket': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        'Kalshi': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        'Manifold': 'text-pink-400 bg-pink-500/10 border-pink-500/30',
        'Metaculus': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    };

    const arbCount = markets.filter(m => m.hasArbitrage).length;
    const watchedCount = markets.filter(m => m.isWatched).length;

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="gradient-orb gradient-orb-cyan w-80 h-80 top-20 -right-40 animate-orb" />
                <div className="gradient-orb gradient-orb-purple w-96 h-96 -bottom-48 -left-48 animate-orb" style={{ animationDelay: '-5s' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-black/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-400 hover:text-white transition">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                            Market Scanner
                        </span>
                        <span className="text-xs text-gray-500">
                            Last update: {lastUpdate.toLocaleTimeString()}
                        </span>
                    </div>
                    <nav className="flex gap-6 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white transition">Dashboard</Link>
                        <Link href="/simulator" className="hover:text-white transition">Simulator</Link>
                        <Link href="/analytics" className="hover:text-white transition">Analytics</Link>
                    </nav>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-6 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-premium rounded-xl p-4">
                        <div className="text-xs text-gray-400 mb-1">Total Markets</div>
                        <div className="text-2xl font-bold text-white">{markets.length}</div>
                    </div>
                    <div className="glass-premium rounded-xl p-4 border border-emerald-500/20">
                        <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-emerald-400" />
                            Arbitrage Opportunities
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">{arbCount}</div>
                    </div>
                    <div className="glass-premium rounded-xl p-4">
                        <div className="text-xs text-gray-400 mb-1">Watchlist</div>
                        <div className="text-2xl font-bold text-amber-400">{watchedCount}</div>
                    </div>
                    <div className="glass-premium rounded-xl p-4">
                        <div className="text-xs text-gray-400 mb-1">24h Volume</div>
                        <div className="text-2xl font-bold text-white">
                            ${(markets.reduce((sum, m) => sum + m.volume24h, 0) / 1000000).toFixed(1)}M
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="glass-premium rounded-xl p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search markets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg
                                         text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500/50"
                            />
                        </div>

                        {/* Platform Filter */}
                        <select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm
                                     focus:outline-none focus:border-cyan-500/50"
                        >
                            {PLATFORMS.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm
                                     focus:outline-none focus:border-cyan-500/50"
                        >
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        {/* Toggle Buttons */}
                        <button
                            onClick={() => setShowArbOnly(!showArbOnly)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                      ${showArbOnly
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-black/40 text-gray-400 border border-white/10 hover:text-white'}`}
                        >
                            <Zap className="w-4 h-4 inline mr-1" />
                            Arb Only
                        </button>

                        <button
                            onClick={() => setShowWatchedOnly(!showWatchedOnly)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                      ${showWatchedOnly
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-black/40 text-gray-400 border border-white/10 hover:text-white'}`}
                        >
                            <Star className="w-4 h-4 inline mr-1" />
                            Watchlist
                        </button>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm
                                     focus:outline-none focus:border-cyan-500/50"
                        >
                            <option value="volume">Sort: Volume</option>
                            <option value="change">Sort: % Change</option>
                            <option value="spread">Sort: Spread</option>
                            <option value="expiry">Sort: Expiry</option>
                        </select>

                        {/* Refresh */}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-2 rounded-lg bg-black/40 border border-white/10 text-gray-400 
                                     hover:text-white transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Markets Table */}
                <div className="glass-premium rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-black/40">
                            <tr className="text-gray-400 text-xs uppercase tracking-wider">
                                <th className="text-left p-4">Market</th>
                                <th className="text-center p-4">Platform</th>
                                <th className="text-center p-4">YES / NO</th>
                                <th className="text-center p-4">24h Change</th>
                                <th className="text-center p-4">Volume</th>
                                <th className="text-center p-4">Spread</th>
                                <th className="text-center p-4">Expiry</th>
                                <th className="text-center p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMarkets.map((market, i) => (
                                <tr
                                    key={market.id}
                                    className={`border-t border-white/5 hover:bg-white/5 transition-colors
                                              ${market.hasArbitrage ? 'bg-emerald-500/5' : ''}`}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {market.hasArbitrage && (
                                                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            )}
                                            <div>
                                                <div className="text-white font-medium line-clamp-1">
                                                    {market.question}
                                                </div>
                                                <div className="text-xs text-gray-500">{market.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${platformColors[market.platform]}`}>
                                            {market.platform}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-mono">
                                        <span className="text-emerald-400">${market.yesPrice.toFixed(2)}</span>
                                        <span className="text-gray-500 mx-1">/</span>
                                        <span className="text-red-400">${market.noPrice.toFixed(2)}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`flex items-center justify-center gap-1 font-mono
                                                        ${market.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {market.change24h >= 0 ? (
                                                <TrendingUp className="w-3 h-3" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3" />
                                            )}
                                            {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-400 font-mono">
                                        ${(market.volume24h / 1000).toFixed(0)}K
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`font-mono ${market.spread < 0.02 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {(market.spread * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-400">
                                        {market.daysToExpiry}d
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => toggleWatch(market.id)}
                                                className={`p-1.5 rounded transition-colors
                                                          ${market.isWatched
                                                        ? 'text-amber-400 hover:text-amber-300'
                                                        : 'text-gray-500 hover:text-white'}`}
                                            >
                                                {market.isWatched ? (
                                                    <Star className="w-4 h-4 fill-current" />
                                                ) : (
                                                    <StarOff className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button className="p-1.5 rounded text-gray-500 hover:text-white transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredMarkets.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                            <p>No markets match your filters</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
