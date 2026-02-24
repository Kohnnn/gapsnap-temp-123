"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PnLChartProps {
    data: Array<{ time: string; pnl: number }>;
}

export function PnLChart({ data }: PnLChartProps) {
    // Use mock data if none provided
    const chartData = data.length > 0 ? data : [
        { time: '09:00', pnl: 0 },
        { time: '10:00', pnl: 450 },
        { time: '11:00', pnl: 890 },
        { time: '12:00', pnl: 1200 },
        { time: '13:00', pnl: 950 },
        { time: '14:00', pnl: 1540 },
        { time: '15:00', pnl: 2100 },
        { time: '16:00', pnl: 2800 },
    ];

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#52525b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#52525b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#141417', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#3b82f6' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="pnl"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPnl)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
