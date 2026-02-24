'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Search, Download, Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const MOCK_HISTORY = [
    { id: '1', timestamp: '2026-01-15 14:30', market: 'US GDP Q1 Growth > 2.5%', side: 'YES', size: 1000, price: 0.42, pnl: 45.00, platform: 'Polymarket' },
    { id: '2', timestamp: '2026-01-15 12:15', market: 'Bitcoin < $60,000 BY MAR', side: 'NO', size: 500, price: 0.65, pnl: -12.50, platform: 'Kalshi' },
    { id: '3', timestamp: '2026-01-14 09:45', market: 'Taylor Swift Album Release Date', side: 'YES', size: 200, price: 0.88, pnl: 156.00, platform: 'PredictX' },
    { id: '4', timestamp: '2026-01-13 16:20', market: 'SpaceX Mars Landing Success', side: 'YES', size: 100, price: 0.15, pnl: 0, platform: 'Polymarket' },
    { id: '5', timestamp: '2026-01-12 11:10', market: 'Fed Rate Cut - March Meeting', side: 'NO', size: 2000, price: 0.35, pnl: -400.00, platform: 'Kalshi' },
];

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const exportToCSV = () => {
        const headers = ['Timestamp', 'Market', 'Side', 'Size', 'Price', 'P&L', 'Platform'];
        const rows = MOCK_HISTORY.map(h => [h.timestamp, h.market, h.side, h.size, h.price, h.pnl, h.platform]);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "trade_history.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <main className="min-h-screen bg-[#0a0a0f] text-white">
            <Header />

            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight gradient-text">Trade History</h1>
                        <p className="text-white/40 mt-1">Audit log of all executed transactions</p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 border border-[#06b6d4]/20 rounded-lg text-[#06b6d4] transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search by market name..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-[#06b6d4]/50 text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70">
                            <Calendar className="w-4 h-4" />
                            Last 30 Days
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white/70">
                            <Filter className="w-4 h-4" />
                            All Platforms
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/2 border-b border-white/5 text-white/40 uppercase tracking-wider text-[10px] font-bold">
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Market</th>
                                <th className="px-6 py-4">Side</th>
                                <th className="px-6 py-4 text-right">Size</th>
                                <th className="px-6 py-4 text-right">Price</th>
                                <th className="px-6 py-4 text-right">P&L</th>
                                <th className="px-6 py-4 text-right">Platform</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_HISTORY.filter(h => h.market.toLowerCase().includes(searchTerm.toLowerCase())).map((trade) => (
                                <tr key={trade.id} className="hover:bg-white/2 transition-colors cursor-pointer">
                                    <td className="px-6 py-4 text-white/60 font-mono text-xs">{trade.timestamp}</td>
                                    <td className="px-6 py-4 font-medium">{trade.market}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trade.side === 'YES' ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                                            }`}>
                                            {trade.side}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono">{trade.size.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-mono">${trade.price.toFixed(2)}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${trade.pnl > 0 ? 'text-[#10b981]' : trade.pnl < 0 ? 'text-[#ef4444]' : 'text-white/40'}`}>
                                        {trade.pnl > 0 ? '+' : ''}{trade.pnl !== 0 ? `$${Math.abs(trade.pnl).toFixed(2)}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-white/40 italic">{trade.platform}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-white/40">
                        <span>Showing 1 to 5 of 24 trades</span>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded border border-white/10 disabled:opacity-20" disabled>
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded border border-white/10">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
