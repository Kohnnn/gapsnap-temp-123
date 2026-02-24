'use client';

import { useMemo } from 'react';

interface CorrelationData {
    labels: string[];
    matrix: number[][];
}

interface CorrelationHeatmapProps {
    data: CorrelationData;
    className?: string;
    cellSize?: number;
}

// Default mock correlation data for prediction markets
const defaultData: CorrelationData = {
    labels: ['BTC $100K', 'ETH $5K', 'Fed Cut', 'Trump Win', 'Recession', 'AI Winter'],
    matrix: [
        [1.00, 0.85, 0.20, 0.15, -0.30, -0.10],
        [0.85, 1.00, 0.25, 0.10, -0.25, -0.15],
        [0.20, 0.25, 1.00, -0.40, 0.60, 0.10],
        [0.15, 0.10, -0.40, 1.00, -0.35, -0.20],
        [-0.30, -0.25, 0.60, -0.35, 1.00, 0.45],
        [-0.10, -0.15, 0.10, -0.20, 0.45, 1.00],
    ],
};

export default function CorrelationHeatmap({
    data = defaultData,
    className = '',
    cellSize = 60,
}: CorrelationHeatmapProps) {
    const { labels, matrix } = data;

    const getColor = (value: number): string => {
        // Map -1 to 1 => red to blue through white
        if (value >= 0) {
            // Positive: white to cyan/blue
            const intensity = Math.min(1, value);
            return `rgba(6, 182, 212, ${intensity * 0.8})`;
        } else {
            // Negative: white to red
            const intensity = Math.min(1, Math.abs(value));
            return `rgba(239, 68, 68, ${intensity * 0.8})`;
        }
    };

    const getTextColor = (value: number): string => {
        return Math.abs(value) > 0.5 ? '#fff' : '#9ca3af';
    };

    return (
        <div className={`glass-premium rounded-xl p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-white mb-4">Market Correlation Matrix</h3>

            <div className="overflow-x-auto">
                <div className="inline-block">
                    {/* Header row */}
                    <div className="flex">
                        <div style={{ width: cellSize * 1.5 }} /> {/* Empty corner */}
                        {labels.map((label, i) => (
                            <div
                                key={`header-${i}`}
                                style={{ width: cellSize }}
                                className="text-xs text-gray-400 text-center pb-2 truncate px-1"
                                title={label}
                            >
                                {label.slice(0, 8)}
                            </div>
                        ))}
                    </div>

                    {/* Matrix rows */}
                    {matrix.map((row, i) => (
                        <div key={`row-${i}`} className="flex">
                            {/* Row label */}
                            <div
                                style={{ width: cellSize * 1.5 }}
                                className="text-xs text-gray-400 flex items-center pr-2 truncate"
                                title={labels[i]}
                            >
                                {labels[i]}
                            </div>

                            {/* Cells */}
                            {row.map((value, j) => (
                                <div
                                    key={`cell-${i}-${j}`}
                                    style={{
                                        width: cellSize,
                                        height: cellSize,
                                        backgroundColor: getColor(value),
                                    }}
                                    className="flex items-center justify-center text-xs font-mono 
                                             border border-white/5 heatmap-cell cursor-pointer
                                             hover:ring-2 hover:ring-cyan-400/50 hover:z-10 relative"
                                    title={`${labels[i]} vs ${labels[j]}: ${value.toFixed(2)}`}
                                >
                                    <span style={{ color: getTextColor(value) }}>
                                        {value.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }} />
                    <span>-1.0 (Negative)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-white/10" />
                    <span>0.0 (Neutral)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(6, 182, 212, 0.8)' }} />
                    <span>+1.0 (Positive)</span>
                </div>
            </div>

            {/* Insights */}
            <div className="mt-4 p-3 rounded-lg bg-black/30 text-xs text-gray-400">
                <strong className="text-white">Key Insight:</strong> Crypto markets (BTC, ETH) are highly correlated.
                Recession fears correlate positively with Fed rate cuts. Diversify across uncorrelated events for optimal risk.
            </div>
        </div>
    );
}
