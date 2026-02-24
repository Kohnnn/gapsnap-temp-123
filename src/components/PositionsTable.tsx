'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

interface Position {
    id: string;
    market: string;
    description: string;
    side: 'YES' | 'NO';
    size: number;
    avgPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercent: number;
    platform: 'Polymarket' | 'Kalshi' | 'PredictX';
}

interface PositionsTableProps {
    positions: Position[];
    className?: string;
}

export default function PositionsTable({ positions, className }: PositionsTableProps) {
    return (
        <div className={`glass-card overflow-hidden flex flex-col ${className}`}>
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-primary">Portfolio Positions</h3>
                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/50">
                    {positions.length} Active
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-white/2 border-b border-white/5 text-white/40 uppercase tracking-wider">
                            <th className="px-4 py-3 font-medium">Market / Side</th>
                            <th className="px-4 py-3 font-medium text-right">Size / Value</th>
                            <th className="px-4 py-3 font-medium text-right">Entry / Mark</th>
                            <th className="px-4 py-3 font-medium text-right">P&L</th>
                            <th className="px-4 py-3 font-medium text-right">Platform</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {positions.map((pos) => (
                            <tr key={pos.id} className="hover:bg-white/2 transition-colors group">
                                <td className="px-4 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="font-medium text-white group-hover:text-primary transition-colors flex items-center gap-1">
                                            {pos.market}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${pos.side === 'YES' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                                                }`}>
                                                {pos.side}
                                            </span>
                                            <span className="text-white/30 text-[10px]">{pos.description}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="text-white font-medium">{pos.size.toLocaleString()} contracts</div>
                                    <div className="text-white/40 text-[10px]">${(pos.size * pos.currentPrice).toLocaleString()}</div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className="text-white/80">{pos.avgPrice.toFixed(2)}</div>
                                    <div className="text-primary font-medium">{pos.currentPrice.toFixed(2)}</div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <div className={`flex items-center justify-end gap-1 font-bold ${pos.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                                        {pos.pnl >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        ${Math.abs(pos.pnl).toLocaleString()}
                                    </div>
                                    <div className={`text-[10px] ${pos.pnlPercent >= 0 ? 'text-success/70' : 'text-destructive/70'}`}>
                                        {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <span className="text-white/50 italic">{pos.platform}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {positions.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-white/20 gap-2">
                    <p>No active positions found</p>
                    <button className="text-[10px] text-primary hover:underline">Access Research Terminal</button>
                </div>
            )}
        </div>
    );
}
