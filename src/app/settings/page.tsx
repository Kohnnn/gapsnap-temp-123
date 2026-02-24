'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import {
    Key,
    Shield,
    Zap,
    Monitor,
    Bell,
    Save,
    RefreshCcw,
    Eye,
    EyeOff,
    CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
    const [showApiKey, setShowApiKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <main className="min-h-screen bg-[#0a0a0f] text-white pb-20">
            <Header />

            <div className="container mx-auto px-6 py-8 flex flex-col gap-8 max-w-4xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight gradient-text">System Settings</h1>
                        <p className="text-white/40 mt-1">Configure your trading environment and security</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-lg text-white font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {isSaved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>

                {/* Account & API */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-2 text-[#06b6d4]">
                        <Key className="w-4 h-4" />
                        <h2 className="text-sm font-bold uppercase tracking-widest">API Connections</h2>
                    </div>
                    <div className="glass-card p-6 flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-white/40 uppercase">Polymarket API Key</label>
                                <div className="relative">
                                    <input
                                        type={showApiKey ? "text" : "password"}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:border-[#06b6d4]/50 text-sm font-mono"
                                        value="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                                        readOnly
                                    />
                                    <button
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60"
                                    >
                                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-white/40 uppercase">Kalshi API Key</label>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 focus:outline-none focus:border-[#06b6d4]/50 text-sm font-mono"
                                    value="••••••••••••••••••••••••••••"
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button className="text-[10px] text-[#06b6d4] hover:underline flex items-center gap-1">
                                <RefreshCcw className="w-3 h-3" /> Rotate Keys
                            </button>
                        </div>
                    </div>
                </section>

                {/* Trading & Risk */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-2 text-[#a855f7]">
                        <Shield className="w-4 h-4" />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Risk Management</h2>
                    </div>
                    <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-white/70">Kelly Fraction</label>
                                <span className="text-xs text-[#a855f7] font-bold">0.25 (Quarter Kelly)</span>
                            </div>
                            <input type="range" min="0" max="1" step="0.05" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            <p className="text-[10px] text-white/30 italic">Determines the aggressiveness of position sizing relative to edge.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold text-white/70">Max Portfolio Exposure</label>
                                <span className="text-xs text-[#a855f7] font-bold">80%</span>
                            </div>
                            <input type="range" min="0" max="100" step="5" className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            <p className="text-[10px] text-white/30 italic">Maximum percentage of balance that can be deployed at once.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Default Order Size ($)</label>
                            <input
                                type="number"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 focus:outline-none focus:border-[#a855f7]/50 text-sm"
                                placeholder="100.00"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-white/40 uppercase">Max Drawdown Limit (%)</label>
                            <input
                                type="number"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 focus:outline-none focus:border-[#a855f7]/50 text-sm"
                                placeholder="15.0"
                            />
                        </div>
                    </div>
                </section>

                {/* Display & UI */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 px-2 text-[#10b981]">
                        <Monitor className="w-4 h-4" />
                        <h2 className="text-sm font-bold uppercase tracking-widest">Display Preferences</h2>
                    </div>
                    <div className="glass-card p-6 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold">Particle Effects</h3>
                                <p className="text-xs text-white/30">Render 3D background particles (requires GPU)</p>
                            </div>
                            <div className="w-10 h-5 bg-[#10b981] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold">Real-time Animation</h3>
                                <p className="text-xs text-white/30">Enable 60fps smoothing on number updates</p>
                            </div>
                            <div className="w-10 h-5 bg-[#10b981] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between opacity-40">
                            <div>
                                <h3 className="text-sm font-bold">Light Theme</h3>
                                <p className="text-xs text-white/30">Switch to high-contrast light mode (Upcoming)</p>
                            </div>
                            <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-not-allowed">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white/20 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications Link */}
                <section className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-white/40" />
                        <div>
                            <h3 className="text-sm font-bold">Notification Toggles</h3>
                            <p className="text-[10px] text-white/30">Manage triggered alerts and webhooks</p>
                        </div>
                    </div>
                    <button className="text-xs text-[#06b6d4] hover:underline font-bold">Go to Alerts Page →</button>
                </section>
            </div>
        </main>
    );
}
