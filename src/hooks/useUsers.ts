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
        getUserCourses,
        getUserStats,
        getUserProgress: usersService.getUserProgress,
        getUserCourseProgress: usersService.getUserCourseProgress
    };
};
