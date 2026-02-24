'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
            ) {
                if (event.key === 'Escape') {
                    event.target.blur();
                }
                return;
            }

            const key = event.key.toLowerCase();

            switch (key) {
                case 't':
                    // Trigger Quick Trade Modal (would ideally use a global state like Zustand)
                    // console.log('Shortcut: Open Trade Modal');
                    window.dispatchEvent(new CustomEvent('toggle-trade-modal'));
                    break;
                case 's':
                    router.push('/scanner');
                    break;
                case 'p':
                    router.push('/portfolio');
                    break;
                case 'c':
                    router.push('/compare');
                    break;
                case 'h':
                    router.push('/history');
                    break;
                case 'a':
                    router.push('/alerts');
                    break;
                case '/':
                    event.preventDefault(); // Prevent text slash
                    window.dispatchEvent(new CustomEvent('focus-search'));
                    break;
                case 'escape':
                    window.dispatchEvent(new CustomEvent('close-all-modals'));
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    // Switch dashboard tabs if on the dashboard
                    window.dispatchEvent(new CustomEvent('switch-tab', { detail: parseInt(key) - 1 }));
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);
}
