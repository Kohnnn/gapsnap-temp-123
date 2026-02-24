'use client';

import React, { useMemo } from 'react';

interface WaterfallItem {
    label: string;
    value: number;
    type: 'start' | 'positive' | 'negative' | 'total';
}

interface WaterfallChartProps {
    data: WaterfallItem[];
    height?: number;
    className?: string;
}

export default function WaterfallChart({ data, height = 300, className }: WaterfallChartProps) {
    const width = 600;
    const padding = 50;

    const processedData = useMemo(() => {
        let current = 0;
        const result: any[] = [];

        for (const item of data) {
            const start = current;
            if (item.type !== 'total' && item.type !== 'start') {
                current += item.value;
            } else if (item.type === 'start') {
                current = item.value;
            }
            // If total, we just use the current value or the explicit total
            const end = item.type === 'total' ? item.value : current;

            result.push({
                ...item,
                start,
                end,
                displayStart: Math.min(start, end),
                displayHeight: Math.abs(end - start) || 2, // Minimum height for visibility
            });
        }
        return result;
    }, [data]);

    const maxValue = Math.max(...processedData.map((d) => Math.max(d.start, d.end, 0)), 1);
    const minValue = Math.min(...processedData.map((d) => Math.min(d.start, d.end, 0)), 0);
    const range = maxValue - minValue || 1;

    const scaleY = (val: number) => height - padding - ((val - minValue) / range) * (height - 2 * padding);
    const scaleX = (idx: number) => padding + (idx * (width - 2 * padding)) / processedData.length;
    const barWidth = ((width - 2 * padding) / processedData.length) * 0.7;

    return (
        <div className={`glass-card p-4 flex flex-col gap-4 ${className}`}>
            <h3 className="text-sm font-bold text-primary">Equity Performance Attribution</h3>

            <div className="relative w-full overflow-hidden bg-black/20 rounded-lg border border-white/5" style={{ height }}>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                        const val = minValue + p * range;
                        return (
                            <g key={`grid-${p}`}>
                                <line
                                    x1={padding}
                                    y1={scaleY(val)}
                                    x2={width - padding}
                                    y2={scaleY(val)}
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="1"
                                />
                                <text x={padding - 5} y={scaleY(val)} fill="rgba(255,255,255,0.3)" fontSize="10" textAnchor="end" dominantBaseline="middle">
                                    {val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </text>
                            </g>
                        );
                    })}

                    {/* Zero Line */}
                    <line
                        x1={padding}
                        y1={scaleY(0)}
                        x2={width - padding}
                        y2={scaleY(0)}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1"
                    />

                    {/* Bars and Connectors */}
                    {processedData.map((item, i) => {
                        const x = scaleX(i) + (barWidth * 0.15);
                        const y = scaleY(item.end);
                        const startY = scaleY(item.start);

                        let color = '#3b82f6'; // Default Primary (Blue)
                        if (item.type === 'positive') color = '#10b981';
                        if (item.type === 'negative') color = '#ef4444';
                        if (item.type === 'start' || item.type === 'total') color = '#64748b';

                        return (
                            <g key={`bar-${i}`}>
                                {/* Connector line to next bar */}
                                {i < processedData.length - 1 && (
                                    <line
                                        x1={x + barWidth}
                                        y1={y}
                                        x2={scaleX(i + 1) + (barWidth * 0.15)}
                                        y2={y}
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeDasharray="2 2"
                                    />
                                )}

                                {/* Bar */}
                                <rect
                                    x={x}
                                    y={Math.min(startY, y)}
                                    width={barWidth}
                                    height={Math.max(Math.abs(startY - y), 2)}
                                    fill={color}
                                    rx="2"
                                    className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                                />

                                {/* Label on top of bar */}
                                <text
                                    x={x + barWidth / 2}
                                    y={Math.min(startY, y) - 5}
                                    fill="white"
                                    fontSize="10"
                                    textAnchor="middle"
                                    fontWeight="500"
                                >
                                    {item.value > 0 && item.type !== 'total' ? `+${item.value}` : item.value}
                                </text>

                                {/* X Axis Label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={height - padding + 15}
                                    fill="rgba(255,255,255,0.5)"
                                    fontSize="10"
                                    textAnchor="middle"
                                    transform={`rotate(15, ${x + barWidth / 2}, ${height - padding + 15})`}
                                >
                                    {item.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
