import { useState, useCallback } from 'react';
import { Achievement } from '@/types';
import { achievementsService } from '@/services/achievements.service';

export const useAchievements = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchAchievements = useCallback(async () => {
        try {
            setLoading(true);
            const data = await achievementsService.getAll();
            setAchievements(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        achievements,
        loading,
        error,
        fetchAchievements,
        getAchievement: achievementsService.getById,
        createAchievement: achievementsService.create,
        updateAchievement: achievementsService.update,
        deleteAchievement: achievementsService.delete
    };
};
