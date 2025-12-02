import { useState, useCallback } from 'react';
import { User } from '@/types';
import { usersService } from '@/services/users.service';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await usersService.getAll();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (userData: Partial<User>) => {
        try {
            setLoading(true);
            const newUser = await usersService.create(userData);
            setUsers(prev => [...prev, newUser]);
            setError(null);
            return newUser;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const enrollUserInCourse = useCallback(async (userEmail: string, courseName: string) => {
        try {
            setLoading(true);
            const result = await usersService.enrollUserInCourse(userEmail, courseName);
            // Refresh users after enrollment
            await fetchUsers();
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const getUserCourses = useCallback(async (email: string) => {
        try {
            setLoading(true);
            const courses = await usersService.getUserCourses(email);
            setError(null);
            return courses;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserStats = useCallback(async () => {
        try {
            setLoading(true);
            const stats = await usersService.getUserStats();
            setError(null);
            return stats;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const unenrollUserFromCourse = useCallback(async (userEmail: string, courseName: string) => {
        try {
            setLoading(true);
            const result = await usersService.unenrollUserFromCourse(userEmail, courseName);
            await fetchUsers();
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const addOrUpdateAssessment = useCallback(async (userId: string, assessmentId: string, score: number, passed: boolean) => {
        try {
            setLoading(true);
            const result = await usersService.addOrUpdateAssessment(userId, assessmentId, score, passed);
            await fetchUsers();
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const deleteAssessment = useCallback(async (userId: string, assessmentId: string) => {
        try {
            setLoading(true);
            const result = await usersService.deleteAssessment(userId, assessmentId);
            await fetchUsers();
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const updateUserXP = useCallback(async (userId: string, xpToAdd: number) => {
        try {
            setLoading(true);
            const result = await usersService.updateUserXP(userId, xpToAdd);
            await fetchUsers();
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const addAchievement = useCallback(async (userId: string, achievementName: string) => {
        try {
            setLoading(true);
            const result = await usersService.addAchievement(userId, achievementName);
            await fetchUsers();
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const removeAchievement = useCallback(async (userId: string, achievementName: string) => {
        try {
            setLoading(true);
            const result = await usersService.removeAchievement(userId, achievementName);
            await fetchUsers();
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    const updateUserBadge = useCallback(async (userId: string, badge: string) => {
        try {
            setLoading(true);
            const result = await usersService.updateUserBadge(userId, badge);
            await fetchUsers();
            setError(null);
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        getUser: usersService.getById,
        getUserByEmail: usersService.getByEmail,
        updateUser: usersService.update,
        enrollUserInCourse,
        unenrollUserFromCourse,
        getUserCourses,
        getUserStats,
        getUserProgress: usersService.getUserProgress,
        getUserCourseProgress: usersService.getUserCourseProgress,
        getUserTechnicalAssessmentProgress: usersService.getUserTechnicalAssessmentProgress,
        addOrUpdateAssessment,
        deleteAssessment,
        updateUserXP,
        addAchievement,
        removeAchievement,
        updateUserBadge
    };
};
