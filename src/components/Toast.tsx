'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).slice(2, 11);
        setToasts((prev) => [...prev, { ...toast, id }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const [progress, setProgress] = useState(100);
    const duration = toast.duration ?? 5000;

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining === 0) {
                clearInterval(interval);
                onClose();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        info: <Info className="w-5 h-5 text-cyan-400" />,
    };

    const colors = {
        success: 'border-emerald-500/30 bg-emerald-500/10',
        error: 'border-red-500/30 bg-red-500/10',
        warning: 'border-amber-500/30 bg-amber-500/10',
        info: 'border-cyan-500/30 bg-cyan-500/10',
    };

    const progressColors = {
        success: 'bg-emerald-400',
        error: 'bg-red-400',
        warning: 'bg-amber-400',
        info: 'bg-cyan-400',
    };

    return (
        <div
            className={`relative overflow-hidden rounded-xl border backdrop-blur-xl 
                       ${colors[toast.type]} animate-slide-in-right`}
        >
            <div className="flex items-start gap-3 p-4">
                <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{toast.title}</p>
                    {toast.message && (
                        <p className="text-xs text-gray-400 mt-1">{toast.message}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                <div
                    className={`h-full ${progressColors[toast.type]} transition-all duration-100 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

// Convenience functions for creating toasts
export function toast(context: ToastContextType, type: ToastType, title: string, message?: string) {
    context.addToast({ type, title, message });
}
