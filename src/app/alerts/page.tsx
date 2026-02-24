'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Bell, BellOff, Plus, AlertTriangle, TrendingUp, Zap, Trash2, Mail, Globe, Braces } from 'lucide-react';

const MOCK_ALERTS = [
    { id: '1', type: 'price', market: 'Bitcoin hit $100k', threshold: '> 0.50', status: 'active', frequency: 'Once' },
    { id: '2', type: 'arb', market: 'Polymarket vs Kalshi Spread', threshold: '> 5%', status: 'active', frequency: 'Continuous' },
    { id: '3', type: 'whale', market: 'Any Politics Market', threshold: '> $10k Trade', status: 'disabled', frequency: 'Continuous' },
];

export default function AlertsPage() {
    const [alerts, setAlerts] = useState(MOCK_ALERTS);

    const toggleAlert = (id: string) => {
        setAlerts(alerts.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'disabled' : 'active' } : a));
    };

    const deleteAlert = (id: string) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <main className="min-h-screen bg-[#0a0a0f] text-white">
            <Header />

            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight gradient-text">Notifications & Alerts</h1>
                        <p className="text-white/40 mt-1">Stay ahead with custom market triggers</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-lg text-white font-bold transition-all shadow-lg shadow-blue-500/20">
                        <Plus className="w-4 h-4" />
                        Create Alert
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Active Alerts List */}
                    <div className="xl:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#06b6d4]">Active Alerts</h2>
                            <span className="text-[10px] text-white/30">{alerts.length} Configured</span>
                        </div>

                        {alerts.map((alert) => (
                            <div key={alert.id} className={`glass-card p-4 flex items-center justify-between transition-all ${alert.status === 'disabled' ? 'opacity-50 grayscale' : 'border-l-4 border-l-[#06b6d4]'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${alert.type === 'price' ? 'bg-blue-500/10 text-blue-400' :
                                            alert.type === 'arb' ? 'bg-purple-500/10 text-purple-400' : 'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        {alert.type === 'price' ? <TrendingUp className="w-5 h-5" /> :
                                            alert.type === 'arb' ? <Zap className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{alert.market}</h3>
                                        <p className="text-xs text-white/40">Trigger: <span className="text-white/70">{alert.threshold}</span> • {alert.frequency}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleAlert(alert.id)}
                                        className={`p-2 rounded-lg transition-colors ${alert.status === 'active' ? 'hover:bg-red-500/10 text-white/40 hover:text-red-400' : 'hover:bg-emerald-500/10 text-white/40 hover:text-emerald-400'}`}
                                        title={alert.status === 'active' ? "Disable Alert" : "Enable Alert"}
                                    >
                                        {alert.status === 'active' ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => deleteAlert(alert.id)}
                                        className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white/80 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {alerts.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center glass-card border-dashed">
                                <BellOff className="w-12 h-12 text-white/10 mb-4" />
                                <p className="text-white/30 text-sm">No alerts configured</p>
                            </div>
                        )}
                    </div>

                    {/* Delivery Methods */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#a855f7] px-2">Delivery Methods</h2>

                        <div className="glass-card p-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Browser Push</p>
                                        <p className="text-[10px] text-white/30">Desktop notifications</p>
                                    </div>
                                </div>
                                <div className="w-10 h-5 bg-[#06b6d4] rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Email Digest</p>
                                        <p className="text-[10px] text-white/30">Daily trade summary</p>
                                    </div>
                                </div>
                                <div className="w-10 h-5 bg-white/20 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                        <Braces className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Webhook</p>
                                        <p className="text-[10px] text-white/30">Custom API endpoints</p>
                                    </div>
                                </div>
                                <div className="w-10 h-5 bg-white/20 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full"></div>
                                </div>
                            </div>

                            <div className="mt-4 pt-6 border-t border-white/5">
                                <p className="text-[10px] text-white/20 italic">Note: Real-time alerts require a stable WebSocket connection.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
