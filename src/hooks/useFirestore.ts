import { useState, useCallback } from 'react';

interface UseFirestoreState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export const useFirestore = <T>() => {
    const [state, setState] = useState<UseFirestoreState<T>>({
        data: null,
        loading: false,
        error: null
    });

    const execute = useCallback(async (promise: Promise<T>) => {
        setState({ data: null, loading: true, error: null });
        try {
            const result = await promise;
            setState({ data: result, loading: false, error: null });
            return result;
        } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
            throw error;
        }
    }, []);

    return {
        ...state,
        execute
    };
};
