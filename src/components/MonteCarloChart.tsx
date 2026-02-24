'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface MonteCarloChartProps {
    paths?: number;
    steps?: number;
    initialValue?: number;
    drift?: number;
    volatility?: number;
    className?: string;
}

interface SimulationPath {
    values: number[];
    finalValue: number;
}

export default function MonteCarloChart({
    paths = 100,
    steps = 50,
    initialValue = 10000,
    drift = 0.08, // 8% annual return
    volatility = 0.25, // 25% annual volatility
    className = '',
}: MonteCarloChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(steps);
    const [simulationData, setSimulationData] = useState<SimulationPath[]>([]);
    const animationRef = useRef<number>(0);

    // Generate simulation paths
    const generatePaths = useMemo(() => {
        const dt = 1 / steps; // Normalize to 1 year
        const sqrtDt = Math.sqrt(dt);
        const allPaths: SimulationPath[] = [];

        for (let p = 0; p < paths; p++) {
            const values: number[] = [initialValue];
            let currentValue = initialValue;

            for (let s = 1; s <= steps; s++) {
                const randomNormal = gaussianRandom();
                // Geometric Brownian Motion
                const returnVal = (drift - 0.5 * volatility * volatility) * dt +
                    volatility * sqrtDt * randomNormal;
                currentValue = currentValue * Math.exp(returnVal);
                values.push(currentValue);
            }

            allPaths.push({
                values,
                finalValue: currentValue,
            });
        }

        return allPaths;
    }, [paths, steps, initialValue, drift, volatility]);

    // Initialize simulation
    useEffect(() => {
        setSimulationData(generatePaths);
        setCurrentStep(steps);
    }, [generatePaths, steps]);

    // Draw chart
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || simulationData.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const padding = { top: 40, right: 20, bottom: 40, left: 60 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Find min/max values for scaling
        let minVal = Infinity;
        let maxVal = -Infinity;
        simulationData.forEach(path => {
            path.values.slice(0, currentStep + 1).forEach(v => {
                minVal = Math.min(minVal, v);
                maxVal = Math.max(maxVal, v);
            });
        });
        minVal = minVal * 0.95;
        maxVal = maxVal * 1.05;

        // Clear canvas
        ctx.fillStyle = 'rgba(10, 10, 15, 1)';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();

            // Y-axis labels
            const value = maxVal - ((maxVal - minVal) / 5) * i;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.font = '11px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(`$${(value / 1000).toFixed(1)}k`, padding.left - 8, y + 4);
        }

        // X-axis labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.textAlign = 'center';
        for (let i = 0; i <= 5; i++) {
            const x = padding.left + (chartWidth / 5) * i;
            const month = Math.round((steps / 5) * i);
            ctx.fillText(`M${month}`, x, height - padding.bottom + 20);
        }

        // Calculate mean path
        const meanPath: number[] = [];
        for (let s = 0; s <= currentStep; s++) {
            const sum = simulationData.reduce((acc, path) => acc + path.values[s], 0);
            meanPath.push(sum / simulationData.length);
        }

        // Draw confidence interval (5th and 95th percentile)
        const sortedFinals = simulationData
            .map(p => p.values[currentStep])
            .sort((a, b) => a - b);
        const p5 = sortedFinals[Math.floor(paths * 0.05)];
        const p95 = sortedFinals[Math.floor(paths * 0.95)];

        // Draw all paths with gradient opacity
        simulationData.forEach((path, i) => {
            const hue = (i / paths) * 60 + 160; // Cyan to purple range
            const opacity = 0.15;

            ctx.beginPath();
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${opacity})`;
            ctx.lineWidth = 1;

            for (let s = 0; s <= currentStep; s++) {
                const x = padding.left + (s / steps) * chartWidth;
                const y = padding.top + (1 - (path.values[s] - minVal) / (maxVal - minVal)) * chartHeight;

                if (s === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });

        // Draw mean path with glow
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;

        for (let s = 0; s <= currentStep; s++) {
            const x = padding.left + (s / steps) * chartWidth;
            const y = padding.top + (1 - (meanPath[s] - minVal) / (maxVal - minVal)) * chartHeight;

            if (s === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw initial value line
        const initialY = padding.top + (1 - (initialValue - minVal) / (maxVal - minVal)) * chartHeight;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding.left, initialY);
        ctx.lineTo(padding.left + chartWidth, initialY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('Monte Carlo Simulation', padding.left, 25);

    }, [simulationData, currentStep, initialValue, steps, paths]);

    // Animation loop
    useEffect(() => {
        if (!isPlaying) return;

        let step = 0;
        const animate = () => {
            step++;
            setCurrentStep(Math.min(step, steps));

            if (step < steps) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setIsPlaying(false);
            }
        };

        setCurrentStep(0);
        animationRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationRef.current);
    }, [isPlaying, steps]);

    const handleReset = () => {
        setIsPlaying(false);
        setSimulationData(generatePaths);
        setCurrentStep(steps);
    };

    // Statistics
    const stats = useMemo(() => {
        if (simulationData.length === 0) return null;

        const finals = simulationData.map(p => p.finalValue);
        const sorted = [...finals].sort((a, b) => a - b);
        const mean = finals.reduce((a, b) => a + b, 0) / finals.length;
        const p5 = sorted[Math.floor(paths * 0.05)];
        const p95 = sorted[Math.floor(paths * 0.95)];
        const winRate = finals.filter(f => f > initialValue).length / finals.length;

        return { mean, p5, p95, winRate };
    }, [simulationData, initialValue, paths]);

    return (
        <div className={`glass-premium rounded-xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4 text-white" />
                        ) : (
                            <Play className="w-4 h-4 text-white" />
                        )}
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4 text-white" />
                    </button>
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-400">
                        {paths} paths • {steps} steps
                    </span>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                width={600}
                height={300}
                className="w-full rounded-lg"
            />

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Expected Value</div>
                        <div className="text-lg font-bold text-white">
                            ${(stats.mean / 1000).toFixed(1)}k
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">5th Percentile</div>
                        <div className="text-lg font-bold text-red-400">
                            ${(stats.p5 / 1000).toFixed(1)}k
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">95th Percentile</div>
                        <div className="text-lg font-bold text-emerald-400">
                            ${(stats.p95 / 1000).toFixed(1)}k
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                        <div className="text-lg font-bold text-cyan-400">
                            {(stats.winRate * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Box-Muller transform for normal distribution
function gaussianRandom(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
