import { ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';

interface RiskMetricProps {
    label: string;
    value: string | number;
    limit: string | number;
    status: 'safe' | 'warning' | 'danger';
}

function RiskMetric({ label, value, limit, status }: RiskMetricProps) {
    const statusColors = {
        safe: 'text-success bg-success/10 border-success/20',
        warning: 'text-warning bg-warning/10 border-warning/20',
        danger: 'text-destructive bg-destructive/10 border-destructive/20',
    };

    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-zinc-900/30">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">{label}</span>
                <span className="text-sm font-bold mt-0.5">{value}</span>
            </div>
            <div className={cn("px-2 py-1 rounded text-[10px] font-bold border", statusColors[status])}>
                Limit: {limit}
            </div>
        </div>
    );
}

export function RiskPanel() {
    return (
        <div className="glass rounded-xl p-5 border border-white/5 h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-success" />
                    <h2 className="text-base font-bold tracking-tight text-white">Risk Metrics</h2>
                </div>
                <div className="px-2 py-0.5 rounded bg-success/10 border border-success/20 text-[10px] font-bold text-success uppercase tracking-widest">
                    Operational
                </div>
            </div>

            <div className="space-y-3">
                <RiskMetric
                    label="Daily Drawdown"
                    value="-$45.20 (0.4%)"
                    limit="10.0%"
                    status="safe"
                />
                <RiskMetric
                    label="Max Daily Loss"
                    value="$45.20"
                    limit="$200.00"
                    status="safe"
                />
                <RiskMetric
                    label="Market Exposure"
                    value="$850.00"
                    limit="$500.00"
                    status="danger"
                />
                <RiskMetric
                    label="Simulation (VaR)"
                    value="$150.25"
                    limit="N/A"
                    status="safe"
                />
            </div>

            <div className="mt-6 p-3 rounded-lg bg-primary/5 border border-primary/10 flex gap-3">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                    Risk simulations are finalized using <span className="text-primary font-bold">10,000</span> Monte Carlo iterations.
                </p>
            </div>
        </div>
    );
}
