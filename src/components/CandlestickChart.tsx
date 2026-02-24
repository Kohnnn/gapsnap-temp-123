'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface CandlestickData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

interface CandlestickChartProps {
    data: CandlestickData[];
    height?: number;
    className?: string;
}

export default function CandlestickChart({ data, height = 400, className }: CandlestickChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            crosshair: {
                mode: 0,
                vertLine: {
                    color: '#06b6d4',
                    width: 1,
                    style: 1,
                    labelBackgroundColor: '#06b6d4',
                },
                horzLine: {
                    color: '#06b6d4',
                    width: 1,
                    style: 1,
                    labelBackgroundColor: '#06b6d4',
                },
            },
        });

        const c = chart as any;
        const candlestickSeries = c.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        candlestickSeries.setData(data);

        // Add volume series if data exists
        if (data.some(d => d.volume !== undefined)) {
            const volumeSeries = c.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '', // set as overlay
            });

            volumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.8,
                    bottom: 0,
                },
            });

            const volumeData = data.map(d => ({
                time: d.time,
                value: d.volume || 0,
                color: d.close >= d.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            }));

            volumeSeries.setData(volumeData);
        }

        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, height]);

    return (
        <div className={`glass-card p-4 flex flex-col gap-4 ${className}`}>
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#06b6d4]">Price History</h3>
                <div className="flex gap-2">
                    {['1H', '1D', '1W', '1M'].map((t) => (
                        <button key={t} className="px-2 py-1 text-[10px] bg-white/5 hover:bg-white/10 rounded border border-white/5 text-white/60">
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={chartContainerRef} className="w-full" style={{ height }} />
        </div>
    );
}
