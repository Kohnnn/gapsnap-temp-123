'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface PriceUpdate {
    marketId: string;
    yesPrice: number;
    noPrice: number;
    timestamp: number;
}

interface UseWebSocketPricesOptions {
    url?: string;
    reconnectInterval?: number;
    onMessage?: (data: PriceUpdate) => void;
    onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
}

interface UseWebSocketPricesReturn {
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
    prices: Map<string, PriceUpdate>;
    subscribe: (marketIds: string[]) => void;
    unsubscribe: (marketIds: string[]) => void;
    reconnect: () => void;
}

/**
 * Custom hook for WebSocket price updates from prediction markets.
 * Handles reconnection, subscription management, and state updates.
 */
export function useWebSocketPrices({
    url = 'ws://localhost:8000/ws/prices',
    reconnectInterval = 5000,
    onMessage,
    onStatusChange,
}: UseWebSocketPricesOptions = {}): UseWebSocketPricesReturn {
    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const [prices, setPrices] = useState<Map<string, PriceUpdate>>(new Map());
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const subscribedMarketsRef = useRef<Set<string>>(new Set());
    const connectRef = useRef<() => void>(() => { });

    const latestOnStatusChange = useRef(onStatusChange);
    useEffect(() => {
        latestOnStatusChange.current = onStatusChange;
    }, [onStatusChange]);

    const updateStatus = useCallback((newStatus: typeof status) => {
        setStatus(newStatus);
        latestOnStatusChange.current?.(newStatus);
    }, []);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        // Avoid synchronous state updates during render phase by using setTimeout
        setTimeout(() => updateStatus('connecting'), 0);

        try {
            const ws = new WebSocket(url);

            ws.onopen = () => {
                updateStatus('connected');
                if (subscribedMarketsRef.current.size > 0) {
                    ws.send(JSON.stringify({
                        type: 'subscribe',
                        markets: Array.from(subscribedMarketsRef.current),
                    }));
                }
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'price_update') {
                        const update: PriceUpdate = {
                            marketId: data.marketId,
                            yesPrice: data.yesPrice,
                            noPrice: data.noPrice,
                            timestamp: Date.now(),
                        };
                        setPrices(prev => new Map(prev).set(data.marketId, update));
                        onMessage?.(update);
                    }
                } catch (e) {
                    console.error('Failed to parse WebSocket message:', e);
                }
            };

            ws.onerror = () => updateStatus('error');
            ws.onclose = () => {
                updateStatus('disconnected');
                wsRef.current = null;
                if (reconnectInterval > 0) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectRef.current();
                    }, reconnectInterval);
                }
            };

            wsRef.current = ws;
        } catch (error) {
            updateStatus('error');
            console.error('WebSocket connection failed:', error);
        }
    }, [url, reconnectInterval, updateStatus, onMessage]);

    useEffect(() => {
        connectRef.current = connect;
    }, [connect]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        updateStatus('disconnected');
    }, [updateStatus]);

    const subscribe = useCallback((marketIds: string[]) => {
        marketIds.forEach(id => subscribedMarketsRef.current.add(id));
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'subscribe', markets: marketIds }));
        }
    }, []);

    const unsubscribe = useCallback((marketIds: string[]) => {
        marketIds.forEach(id => subscribedMarketsRef.current.delete(id));
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'unsubscribe', markets: marketIds }));
        }
    }, []);

    const reconnect = useCallback(() => {
        disconnect();
        connect();
    }, [connect, disconnect]);

    useEffect(() => {
        // Delay slightly to avoid React StrictMode double-invoke issues
        const timer = setTimeout(() => connect(), 0);
        return () => {
            clearTimeout(timer);
            disconnect();
        };
    }, [connect, disconnect]);

    return { status, prices, subscribe, unsubscribe, reconnect };
}

export function useSimulatedPrices(
    markets: { id: string; yesPrice: number }[],
    updateInterval = 2000
): Map<string, PriceUpdate> {
    // Initialize state lazily to verify avoid setting state in effect
    const [prices, setPrices] = useState<Map<string, PriceUpdate>>(() => {
        const initial = new Map<string, PriceUpdate>();
        markets.forEach(m => {
            initial.set(m.id, {
                marketId: m.id,
                yesPrice: m.yesPrice,
                noPrice: 1 - m.yesPrice,
                timestamp: Date.now(),
            });
        });
        return initial;
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev => {
                const next = new Map(prev);
                const marketIds = Array.from(next.keys());
                if (marketIds.length === 0) return next;

                const randomId = marketIds[Math.floor(Math.random() * marketIds.length)];
                const current = next.get(randomId);

                if (current) {
                    const change = (Math.random() - 0.5) * 0.04;
                    const newYes = Math.max(0.01, Math.min(0.99, current.yesPrice + change));

                    next.set(randomId, {
                        marketId: randomId,
                        yesPrice: newYes,
                        noPrice: 1 - newYes,
                        timestamp: Date.now(),
                    });
                }
                return next;
            });
        }, updateInterval);

        return () => clearInterval(interval);
    }, [updateInterval]); // markets dependency removed since it only seeds initial state

    return prices;
}
