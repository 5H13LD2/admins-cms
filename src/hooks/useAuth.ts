import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/services/auth.service';
import { auth } from '@/services/firebase';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = authService.signIn;
    const signUp = authService.signUp;
    const signOut = authService.signOut;

    return {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user
    };
};
