import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

export async function getMarkets(platform?: string) {
    try {
        const { data } = await api.get('/api/markets', { params: { platform } });
        return data;
    } catch (error) {
        console.error('Error fetching markets:', error);
        return [];
    }
}

export async function getArbitrageOpportunities() {
    try {
        const { data } = await api.get('/api/arbitrage');
        return data;
    } catch (error) {
        console.error('Error fetching arbitrage:', error);
        return [];
    }
}

export async function getRiskMetrics() {
    try {
        const { data } = await api.get('/api/risk');
        return data;
    } catch (error) {
        console.error('Error fetching risk metrics:', error);
        return null;
    }
}

export async function getStatus() {
    try {
        const { data } = await api.get('/api/status');
        return data;
    } catch (error) {
        console.error('Error fetching status:', error);
        return null;
    }
}
