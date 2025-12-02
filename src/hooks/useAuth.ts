import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { auth } from '@/services/firebase';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<'admin' | 'student' | 'instructor' | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // Fetch user data from Firestore to get role
                    const userData = await usersService.getByEmail(firebaseUser.email || '');
                    setUserRole(userData?.role || null);
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        const firebaseUser = await authService.signIn(email, password);

        // Check if user is admin
        const userData = await usersService.getByEmail(email);

        if (userData?.role !== 'admin') {
            // Sign out non-admin users
            await authService.signOut();
            throw new Error('Access denied. Only administrators can access this system.');
        }

        setUserRole(userData.role);
        return firebaseUser;
    };

    const signUp = authService.signUp;
    const signOut = authService.signOut;

    return {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
        userRole,
        isAdmin: userRole === 'admin'
    };
};
