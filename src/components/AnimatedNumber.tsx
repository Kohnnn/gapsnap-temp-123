'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    format?: 'currency' | 'percent' | 'number' | 'compact';
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    showChange?: boolean;
}

export default function AnimatedNumber({
    value,
    duration = 800,
    format = 'number',
    decimals = 2,
    prefix = '',
    suffix = '',
    className = '',
    showChange = true,
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(value);
    const [isIncreasing, setIsIncreasing] = useState<boolean | null>(null);
    const previousValue = useRef(value);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const startValue = previousValue.current;
        const endValue = value;
        const diff = endValue - startValue;

        if (diff !== 0) {
            setIsIncreasing(diff > 0);
        }

        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentValue = startValue + diff * eased;
            setDisplayValue(currentValue);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setIsIncreasing(null);
                previousValue.current = value;
            }
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationRef.current);
    }, [value, duration]);

    const formatValue = (val: number): string => {
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                }).format(val);
            case 'percent':
                return `${val.toFixed(decimals)}%`;
            case 'compact':
                if (Math.abs(val) >= 1_000_000) {
                    return `${(val / 1_000_000).toFixed(1)}M`;
                } else if (Math.abs(val) >= 1_000) {
                    return `${(val / 1_000).toFixed(1)}K`;
                }
                return val.toFixed(decimals);
            default:
                return val.toFixed(decimals);
        }
    };

    const changeClass = showChange && isIncreasing !== null
        ? isIncreasing
            ? 'text-emerald-400 animate-pulse'
            : 'text-red-400 animate-pulse'
        : '';

    return (
        <span className={`transition-colors duration-300 tabular-nums ${changeClass} ${className}`}>
            {prefix}{formatValue(displayValue)}{suffix}
        </span>
    );
}

// Convenience wrappers
export function AnimatedCurrency({ value, ...props }: Omit<AnimatedNumberProps, 'format'>) {
    return <AnimatedNumber value={value} format="currency" {...props} />;
}

export function AnimatedPercent({ value, ...props }: Omit<AnimatedNumberProps, 'format'>) {
    return <AnimatedNumber value={value} format="percent" {...props} />;
}

export function AnimatedCompact({ value, ...props }: Omit<AnimatedNumberProps, 'format'>) {
    return <AnimatedNumber value={value} format="compact" {...props} />;
}
