import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { BookOpen, BarChart2, ClipboardCheck } from 'lucide-react';
import Snowfall from '@/components/common/Snowfall';

const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/assets/login-bg.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Snowfall />
      {/* overlay to improve readability */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative w-full max-w-6xl flex items-center justify-center gap-12">
        {/* Left side - Branding */}
        <div
          className="hidden lg:flex flex-col items-start justify-center flex-1 animate-in fade-in zoom-in-95"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-transparent rounded-xl">
              <picture>
                <source srcSet="/assets/techlaunch-logo.png" type="image/png" />
                <source srcSet="/assets/techlaunch-logo.jpg" type="image/jpeg" />
                <img src="/assets/techlaunch-logo.svg" alt="TechLaunch logo" className="w-16 h-16 object-contain" />
              </picture>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-foreground">TechLaunch</h2>
              <p className="text-muted-foreground">Content Management System</p>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-foreground mb-4">Manage Your Learning Platform</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Access powerful tools to create, manage, and track educational content. Empower learners with engaging
            courses and assessments.
          </p>

          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Course Management</h4>
                <p className="text-sm text-muted-foreground">Create and organize comprehensive learning paths</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BarChart2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Student Analytics</h4>
                <p className="text-sm text-muted-foreground">Track progress and performance metrics</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Assessment Tools</h4>
                <p className="text-sm text-muted-foreground">Build quizzes and track achievements</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
