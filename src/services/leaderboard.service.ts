import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { db } from './firebase';
import { LeaderboardEntry } from '@/types';

const USERS_COLLECTION = 'users';

export const leaderboardService = {
    // Get leaderboard
    getLeaderboard: async (limitCount: number = 10): Promise<LeaderboardEntry[]> => {
        try {
            // Assuming users collection has points/score fields
            // If there's a dedicated leaderboard collection, use that instead
            // For now, querying users sorted by totalPoints
            const q = query(
                collection(db, USERS_COLLECTION),
                orderBy('totalPoints', 'desc'),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc, index) => {
                const data = doc.data();
                return {
                    userId: doc.id,
                    username: data.username || data.displayName || 'Anonymous',
                    avatar: data.photoURL || data.avatar,
                    totalPoints: data.totalPoints || 0,
                    rank: index + 1,
                    quizScore: data.quizScore || 0,
                    challengeScore: data.challengeScore || 0,
                    streakDays: data.streakDays || 0
                } as LeaderboardEntry;
            });
        } catch (error) {
            console.error('Error getting leaderboard:', error);
            throw error;
        }
    }
};
