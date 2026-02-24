'use client';

import { useMemo } from 'react';

interface GreeksData {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
}

interface GreeksRadarProps {
    data: GreeksData;
    size?: number;
    className?: string;
    showLabels?: boolean;
    animated?: boolean;
}

const GREEKS = [
    { key: 'delta', symbol: 'Δ', label: 'Delta', color: '#06b6d4' },
    { key: 'gamma', symbol: 'Γ', label: 'Gamma', color: '#a855f7' },
    { key: 'theta', symbol: 'Θ', label: 'Theta', color: '#f472b6' },
    { key: 'vega', symbol: 'ν', label: 'Vega', color: '#f59e0b' },
    { key: 'rho', symbol: 'ρ', label: 'Rho', color: '#10b981' },
] as const;

export default function GreeksRadar({
    data,
    size = 300,
    className = '',
    showLabels = true,
    animated = true,
}: GreeksRadarProps) {
    const center = size / 2;
    const radius = (size / 2) * 0.7;
    const levels = 5;

    // Normalize values to 0-1 range (assuming inputs are -1 to 1 or similar)
    const normalizedData = useMemo(() => ({
        delta: Math.min(1, Math.max(0, Math.abs(data.delta))),
        gamma: Math.min(1, Math.max(0, Math.abs(data.gamma))),
        theta: Math.min(1, Math.max(0, Math.abs(data.theta) * 100)), // Scale theta
        vega: Math.min(1, Math.max(0, Math.abs(data.vega))),
        rho: Math.min(1, Math.max(0, Math.abs(data.rho) * 10)), // Scale rho
    }), [data]);

    // Calculate polygon points
    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / GREEKS.length - Math.PI / 2;
        const r = radius * value;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    const polygonPoints = GREEKS.map((g, i) =>
        getPoint(i, normalizedData[g.key as keyof GreeksData])
    );

    const polygonPath = polygonPoints.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ') + ' Z';

    // Grid circles
    const gridCircles = Array.from({ length: levels }, (_, i) => {
        const r = (radius / levels) * (i + 1);
        return (
            <circle
                key={i}
                cx={center}
                cy={center}
                r={r}
                className="radar-grid"
            />
        );
    });

    // Axis lines
    const axisLines = GREEKS.map((_, i) => {
        const angle = (Math.PI * 2 * i) / GREEKS.length - Math.PI / 2;
        const x2 = center + radius * Math.cos(angle);
        const y2 = center + radius * Math.sin(angle);
        return (
            <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                className="radar-axis"
            />
        );
    });

    // Label positions
    const labels = GREEKS.map((g, i) => {
        const angle = (Math.PI * 2 * i) / GREEKS.length - Math.PI / 2;
        const labelRadius = radius + 30;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const value = data[g.key as keyof GreeksData];

        return (
            <g key={g.key}>
                <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    className="fill-white text-lg font-bold"
                    style={{ fontFamily: 'serif' }}
                >
                    {g.symbol}
                </text>
                {showLabels && (
                    <text
                        x={x}
                        y={y + 10}
                        textAnchor="middle"
                        className="fill-gray-400 text-xs"
                    >
                        {value >= 0 ? '+' : ''}{value.toFixed(3)}
                    </text>
                )}
            </g>
        );
    });

    // Data points with glow
    const dataPoints = polygonPoints.map((p, i) => (
        <g key={i}>
            {/* Glow effect */}
            <circle
                cx={p.x}
                cy={p.y}
                r={8}
                fill={GREEKS[i].color}
                opacity={0.3}
                filter="blur(4px)"
            />
            {/* Main point */}
            <circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill={GREEKS[i].color}
                className="transition-all duration-500"
            />
        </g>
    ));

    return (
        <div className={`relative ${className}`}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Gradient definitions */}
                <defs>
                    <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid */}
                {gridCircles}
                {axisLines}

                {/* Data area */}
                <path
                    d={polygonPath}
                    fill="url(#radarGradient)"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    filter="url(#glow)"
                    className={animated ? 'transition-all duration-500' : ''}
                />

                {/* Data points */}
                {dataPoints}

                {/* Labels */}
                {labels}
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Greeks</div>
                </div>
            </div>
        </div>
    );
}
