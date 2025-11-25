import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
        success: (msg: string) => addToast(msg, 'success'),
        error: (msg: string) => addToast(msg, 'error'),
        info: (msg: string) => addToast(msg, 'info'),
        warning: (msg: string) => addToast(msg, 'warning')
    };
};
