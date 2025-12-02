import { useState, useEffect, useCallback } from 'react';
import { DailyProblem } from '@/types';
import { dailyProblemsService } from '@/services/dailyProblems.service';

export const useDailyProblems = () => {
    const [problems, setProblems] = useState<DailyProblem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await dailyProblemsService.getAll();
            setProblems(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching daily problems:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProblems();
    }, [fetchProblems]);

    // Wrap CRUD operations to auto-refresh
    const createProblem = useCallback(async (problemData: Omit<DailyProblem, 'id'>) => {
        const id = await dailyProblemsService.create(problemData);
        await fetchProblems(); // Refresh list after creation
        return id;
    }, [fetchProblems]);

    const updateProblem = useCallback(async (id: string, problemData: Partial<DailyProblem>) => {
        await dailyProblemsService.update(id, problemData);
        await fetchProblems(); // Refresh list after update
    }, [fetchProblems]);

    const deleteProblem = useCallback(async (id: string) => {
        await dailyProblemsService.delete(id);
        await fetchProblems(); // Refresh list after deletion
    }, [fetchProblems]);

    return {
        problems,
        loading,
        error,
        refresh: fetchProblems,
        getProblem: dailyProblemsService.getById,
        createProblem,
        updateProblem,
        deleteProblem
    };
};
