'use client';

import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

interface TreemapNode {
    name: string;
    value: number;
    change: number;
    children?: TreemapNode[];
}

interface PortfolioTreemapProps {
    data: TreemapNode[];
    height?: number;
    className?: string;
}

const CustomizedContent = (props: {
    root: any;
    depth: number;
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    payload: any;
    colors: string[];
    rank: number;
    name: string;
    change: number;
}) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name, change } = props;

    // Determine color based on change
    // Determine color based on performance (Success/Destructive tint)
    const color = change >= 0
        ? `rgba(16, 185, 129, ${Math.min(0.1 + (change / 15), 0.6)})`
        : `rgba(239, 68, 68, ${Math.min(0.1 + (Math.abs(change) / 15), 0.6)})`;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: color,
                    stroke: 'rgba(255,255,255,0.1)',
                    strokeWidth: 1,
                }}
                rx={4}
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 - 5}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={Math.min(width / 10, 12)}
                    fontWeight="600"
                >
                    {name}
                </text>
            )}
            {width > 50 && height > 50 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 10}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize={Math.min(width / 12, 10)}
                >
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                </text>
            )}
        </g>
    );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-900/95 border border-white/10 p-2 rounded text-[10px] backdrop-blur-md shadow-2xl">
                <p className="font-bold text-primary">{data.name}</p>
                <p className="text-white">Allocation: ${data.value.toLocaleString()}</p>
                <p className={data.change >= 0 ? 'text-success' : 'text-destructive'}>
                    Growth: {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                </p>
            </div>
        );
    }
    return null;
};

export default function PortfolioTreemap({ data, height = 400, className }: PortfolioTreemapProps) {
    return (
        <div className={`glass-card p-4 flex flex-col gap-4 ${className}`}>
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-primary text-blue-400">Asset Allocation Analysis</h3>
                <div className="text-[10px] text-white/40">Area = Equity Weighting | Gradient = Trailing Performance</div>
            </div>
            <div className="w-full bg-black/10 rounded-lg overflow-hidden" style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={data as any}
                        dataKey="value"
                        stroke="#fff"
                        content={CustomizedContent as any}
                    >
                        <Tooltip content={<CustomTooltip />} />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
