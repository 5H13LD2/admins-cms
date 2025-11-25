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

    return {
        users,
        loading,
        error,
        fetchUsers,
        getUser: usersService.getById,
        updateUser: usersService.update,
        getUserProgress: usersService.getUserProgress
    };
};
