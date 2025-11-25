import { useState, useCallback } from 'react';
import { DailyProblem } from '@/types';
import { dailyProblemsService } from '@/services/dailyProblems.service';

export const useDailyProblems = () => {
    const [problems, setProblems] = useState<DailyProblem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProblems = useCallback(async () => {
        try {
            setLoading(true);
            const data = await dailyProblemsService.getAll();
            setProblems(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        problems,
        loading,
        error,
        fetchProblems,
        getProblem: dailyProblemsService.getById,
        createProblem: dailyProblemsService.create,
        updateProblem: dailyProblemsService.update,
        deleteProblem: dailyProblemsService.delete
    };
};
