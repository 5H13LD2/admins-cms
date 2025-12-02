import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginCredentials } from '@/types/auth.types';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginForm = () => {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(credentials.email, credentials.password);
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);

            // Handle Firebase auth errors and custom errors
            let errorMessage: string;

            if (err.message && err.message.includes('Access denied')) {
                errorMessage = err.message;
            } else if (err.code) {
                errorMessage = getFirebaseErrorMessage(err.code);
            } else {
                errorMessage = 'An error occurred during login. Please try again.';
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };



    const getFirebaseErrorMessage = (code: string): string => {
        switch (code) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            default:
                return 'An error occurred during login. Please try again.';
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-card border border-border rounded-xl shadow-lg p-8 animate-in fade-in">
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to access the TechLaunch admin panel</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <div className="space-y-4">


                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 placeholder:text-muted-foreground"
                                    placeholder="you@example.com"
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    className="block w-full pl-10 pr-10 py-2.5 border border-input bg-background text-foreground rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150 placeholder:text-muted-foreground"
                                    placeholder="Enter your password"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">Remember me</label>
                            </div>

                            <a href="/auth/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-2.5 px-4 rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">Don't have an account? <a href="/auth/signup" className="font-medium text-primary hover:text-primary/80">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};
