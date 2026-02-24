import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
    return (
        <div className={cn("glass rounded-xl p-5 card-hover", className)}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-zinc-500 text-sm font-medium">{label}</p>
                    <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
                    {trend && (
                        <p className={cn(
                            "text-xs mt-2 flex items-center font-medium",
                            trend.isPositive ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {trend.isPositive ? '↑' : '↓'} {trend.value}%
                            <span className="text-zinc-600 ml-1">vs yesterday</span>
                        </p>
                    )}
                </div>
                <div className="bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20">
                    <Icon className="w-5 h-5 text-blue-500" />
                </div>
            </div>
        </div>
    );
}

import { LayoutDashboard, Zap, ShieldAlert, BarChart3, Settings, Activity, Target, Search, Wifi, WifiOff, Shuffle, History as HistoryIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
    const [isConnected, setIsConnected] = useState(true);

    // Simulate connection status
    useEffect(() => {
        const interval = setInterval(() => {
            setIsConnected(prev => Math.random() > 0.05 ? true : !prev);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="border-b border-white/5 glass sticky top-0 z-50">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3 group/logo">
                        <div className="w-9 h-9 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center transition-all duration-300 overflow-hidden relative">
                            <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-white leading-none">
                                GAPSNAP
                            </span>
                            <span className="text-[8px] font-bold text-slate-500 tracking-[0.2em] uppercase leading-none mt-1">
                                Quantitative Research
                            </span>
                        </div>
                    </Link>
                    <div className={cn(
                        "ml-4 px-2 py-0.5 rounded-full border flex items-center gap-1.5",
                        isConnected
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-red-500/10 border-red-500/20"
                    )}>
                        {isConnected ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Offline</span>
                            </>
                        )}
                    </div>
                </div>

                <nav className="hidden xl:flex items-center gap-1">
                    <NavLink href="/" icon={LayoutDashboard} label="Terminal" />
                    <NavLink href="/portfolio" icon={Activity} label="Portfolio" />
                    <NavLink href="/scanner" icon={Search} label="Terminal" />
                    <NavLink href="/compare" icon={Shuffle} label="Arbitrage" />
                    <NavLink href="/simulator" icon={Target} label="Strategy" />
                    <NavLink href="/analytics" icon={Activity} label="Analytics" />
                    <NavLink href="/history" icon={HistoryIcon} label="Audits" />
                    <NavLink href="/thesis" icon={BarChart3} label="Methodology" />
                </nav>

                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-tighter">Latency: 14ms</span>
                    </div>
                    <Link href="/settings" className="p-2 hover:bg-white/10 rounded-xl transition-all border border-white/5 hover:border-white/20 group/settings">
                        <Settings className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                    </Link>
                    <div className="relative group/user">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white cursor-pointer group-hover/user:bg-slate-700 transition-all">
                            KV
                        </div>
                        <div className="absolute top-[calc(100%+5px)] right-0 w-2 h-2 bg-[#06b6d4] rounded-full border-2 border-[#0a0a0f] z-10"></div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function NavLink({ href, icon: Icon, label }: { href: string, icon: LucideIcon, label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium 
                     text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    );
}

