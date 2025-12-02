import { createContext, useContext, ReactNode, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<User>;
    signUp: (email: string, password: string) => Promise<User>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
    userRole: 'admin' | 'student' | 'instructor' | null;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuth();

    useEffect(() => {
        console.log('🔑 AuthProvider - Auth state changed:', {
            user: auth.user?.email,
            loading: auth.loading,
            isAuthenticated: auth.isAuthenticated
        });
    }, [auth.user, auth.loading, auth.isAuthenticated]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
