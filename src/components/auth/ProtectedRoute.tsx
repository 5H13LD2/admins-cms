import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, loading, userRole, signOut } = useAuthContext();

    // Sign out non-admin users if they somehow get past login
    useEffect(() => {
        if (!loading && isAuthenticated && userRole && userRole !== 'admin') {
            console.warn('Non-admin user detected, signing out...');
            signOut();
        }
    }, [loading, isAuthenticated, userRole, signOut]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Additional check: prevent non-admin access
    if (userRole && userRole !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
