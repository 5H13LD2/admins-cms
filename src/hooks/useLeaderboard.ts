import { useState, useCallback } from 'react';
import { LeaderboardEntry } from '@/types';
import { leaderboardService } from '@/services/leaderboard.service';

export const useLeaderboard = (limitCount: number = 10) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            const data = await leaderboardService.getLeaderboard(limitCount);
            setLeaderboard(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [limitCount]);

    return {
        leaderboard,
        loading,
        error,
        fetchLeaderboard
    };
};
