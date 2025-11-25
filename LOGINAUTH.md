# TechLaunch CMS - Complete Folder Structure with Authentication

```
techlaunch-cms/
│
├── 📁 public/
│   ├── index.html
│   ├── favicon.ico
│   └── 📁 assets/
│       ├── 📁 images/
│       │   └── logo.png
│       └── 📁 icons/
│
├── 📁 src/
│   │
│   ├── 📁 components/
│   │   │
│   │   ├── 📁 ui/                    [Shadcn/UI Base Components]
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── label.tsx             ← ADD for forms
│   │   │   ├── checkbox.tsx          ← ADD for "remember me"
│   │   │   ├── alert.tsx             ← ADD for error messages
│   │   │   └── ...
│   │   │
│   │   ├── 📁 auth/                  [🆕 NEW - Authentication Components]
│   │   │   ├── LoginForm.tsx         → Login form with validation
│   │   │   ├── ProtectedRoute.tsx    → Route guard for protected pages
│   │   │   └── LogoutButton.tsx      → Logout button component
│   │   │
│   │   ├── 📁 layout/                [Layout Components]
│   │   │   ├── Sidebar.tsx           → Main navigation
│   │   │   ├── Header.tsx            → Top bar with search + logout
│   │   │   ├── Footer.tsx
│   │   │   ├── DashboardLayout.tsx   → Wrapper layout
│   │   │   └── CMSLayout.tsx
│   │   │
│   │   ├── 📁 cards/                 [Display Cards]
│   │   │   ├── ModuleCard.tsx        ✅ Existing
│   │   │   ├── LessonCard.tsx        ✅ Existing
│   │   │   ├── QuizCard.tsx          ✅ Existing
│   │   │   ├── DetailedQuizCard.tsx  ✅ Existing
│   │   │   ├── DetailedAssessmentCard.tsx ✅ Existing
│   │   │   ├── UserCard.tsx          ✅ Existing
│   │   │   ├── CourseCard.tsx
│   │   │   └── AchievementCard.tsx
│   │   │
│   │   ├── 📁 forms/                 [Form Components]
│   │   │   ├── ModuleForm.tsx        → Create/Edit modules
│   │   │   ├── LessonForm.tsx        → Create/Edit lessons
│   │   │   ├── QuizForm.tsx          → Create/Edit quizzes
│   │   │   ├── QuestionForm.tsx      → Individual question editor
│   │   │   ├── AssessmentForm.tsx    → Technical assessments
│   │   │   ├── CourseForm.tsx
│   │   │   └── UserForm.tsx
│   │   │
│   │   ├── 📁 modals/                [Modal Dialogs]
│   │   │   ├── DeleteConfirmModal.tsx
│   │   │   ├── EditModal.tsx
│   │   │   ├── CreateModal.tsx
│   │   │   └── PreviewModal.tsx
│   │   │
│   │   ├── 📁 tables/                [Data Tables]
│   │   │   ├── DataTable.tsx         → Reusable base table
│   │   │   ├── UsersTable.tsx
│   │   │   ├── QuizzesTable.tsx
│   │   │   ├── AssessmentsTable.tsx
│   │   │   └── LeaderboardTable.tsx
│   │   │
│   │   ├── 📁 charts/                [Analytics Charts]
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   ├── ActivityChart.tsx
│   │   │   └── AnalyticsChart.tsx
│   │   │
│   │   └── 📁 common/                [Shared Components]
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── SearchBar.tsx
│   │       ├── FilterPanel.tsx
│   │       ├── Pagination.tsx
│   │       └── BreadcrumbNav.tsx
│   │
│   ├── 📁 pages/                     [Page Components]
│   │   │
│   │   ├── 📁 auth/                  [🆕 NEW - Auth Pages]
│   │   │   ├── LoginPage.tsx         → Admin login page
│   │   │   └── UnauthorizedPage.tsx  → Access denied page
│   │   │
│   │   ├── Dashboard.tsx             🏠 Main dashboard
│   │   │
│   │   ├── 📁 courses/
│   │   │   ├── CoursesPage.tsx       → List all courses
│   │   │   ├── CourseDetailsPage.tsx → Single course view
│   │   │   └── CreateCoursePage.tsx  → Create new course
│   │   │
│   │   ├── 📁 modules/
│   │   │   ├── ModulesPage.tsx       → List all modules
│   │   │   ├── ModuleDetailsPage.tsx → Single module view
│   │   │   └── CreateModulePage.tsx  → Create new module
│   │   │
│   │   ├── 📁 lessons/
│   │   │   ├── LessonsPage.tsx       → List all lessons
│   │   │   ├── LessonDetailsPage.tsx → Single lesson view
│   │   │   └── CreateLessonPage.tsx  → Create new lesson
│   │   │
│   │   ├── 📁 quizzes/
│   │   │   ├── QuizzesPage.tsx       → List all quizzes
│   │   │   ├── QuizDetailsPage.tsx   → Single quiz view
│   │   │   ├── CreateQuizPage.tsx    → Create new quiz
│   │   │   └── QuizManagementPage.tsx → Advanced management
│   │   │
│   │   ├── 📁 assessments/
│   │   │   ├── AssessmentsPage.tsx   → List all assessments
│   │   │   ├── AssessmentDetailsPage.tsx
│   │   │   └── CreateAssessmentPage.tsx
│   │   │
│   │   ├── 📁 users/
│   │   │   ├── UsersPage.tsx         → User management
│   │   │   ├── UserDetailsPage.tsx   → Individual user stats
│   │   │   └── UserProgressPage.tsx  → Progress tracking
│   │   │
│   │   ├── 📁 leaderboard/
│   │   │   └── LeaderboardPage.tsx   → Rankings & scores
│   │   │
│   │   ├── 📁 achievements/
│   │   │   ├── AchievementsPage.tsx
│   │   │   └── CreateAchievementPage.tsx
│   │   │
│   │   ├── 📁 daily-problems/
│   │   │   ├── DailyProblemsPage.tsx
│   │   │   └── CreateDailyProblemPage.tsx
│   │   │
│   │   ├── 📁 feedback/
│   │   │   └── FeedbackPage.tsx      → User feedback review
│   │   │
│   │   ├── 📁 analytics/
│   │   │   ├── AnalyticsPage.tsx     → Overview analytics
│   │   │   └── ReportsPage.tsx       → Detailed reports
│   │   │
│   │   └── 📁 settings/
│   │       └── SettingsPage.tsx      → CMS settings
│   │
│   ├── 📁 hooks/                     [Custom React Hooks]
│   │   ├── useAuth.ts                → 🔐 Authentication hook
│   │   ├── useFirestore.ts           → Firestore operations
│   │   ├── useCourses.ts             → Course data
│   │   ├── useModules.ts             → Module data
│   │   ├── useLessons.ts             → Lesson data
│   │   ├── useQuizzes.ts             → Quiz data
│   │   ├── useAssessments.ts         → Assessment data
│   │   ├── useUsers.ts               → User data
│   │   ├── useUserProgressData.ts    ✅ Existing
│   │   ├── useLeaderboard.ts
│   │   ├── useAchievements.ts
│   │   ├── useDailyProblems.ts
│   │   ├── useFeedback.ts
│   │   └── useToast.ts
│   │
│   ├── 📁 services/                  [Firebase Services]
│   │   ├── firebase.ts               🔥 Firebase config
│   │   ├── auth.service.ts           → 🔐 Admin authentication
│   │   ├── courses.service.ts        → CRUD for courses
│   │   ├── modules.service.ts        → CRUD for modules
│   │   ├── lessons.service.ts        → CRUD for lessons
│   │   ├── quizzes.service.ts        → CRUD for quizzes
│   │   ├── assessments.service.ts    → CRUD for assessments
│   │   ├── users.service.ts          → User management
│   │   ├── leaderboard.service.ts    → Leaderboard operations
│   │   ├── achievements.service.ts   → Achievement operations
│   │   ├── dailyProblems.service.ts  → Daily problem operations
│   │   ├── feedback.service.ts       → Feedback operations
│   │   └── storage.service.ts        → File uploads
│   │
│   ├── 📁 config/                    [🆕 NEW - Configuration]
│   │   ├── admin.config.ts           → Admin credentials & settings
│   │   └── routes.config.ts          → Route definitions
│   │
│   ├── 📁 data/                      [Dummy Data & Mock Data]
│   │   ├── dummyData.ts              ✅ Existing
│   │   ├── courses.dummy.ts
│   │   ├── modules.dummy.ts
│   │   ├── lessons.dummy.ts
│   │   ├── quizzes.dummy.ts
│   │   ├── assessments.dummy.ts
│   │   └── users.dummy.ts
│   │
│   ├── 📁 types/                     [TypeScript Type Definitions]
│   │   ├── index.ts                  → Export all types
│   │   ├── auth.types.ts             → 🆕 Auth type definitions
│   │   ├── course.types.ts
│   │   ├── module.types.ts
│   │   ├── lesson.types.ts
│   │   ├── quiz.types.ts
│   │   ├── assessment.types.ts
│   │   ├── user.types.ts
│   │   ├── achievement.types.ts
│   │   └── firebase.types.ts
│   │
│   ├── 📁 utils/                     [Utility Functions]
│   │   ├── formatters.ts             → Date, number formatting
│   │   ├── validators.ts             → Form validation
│   │   ├── helpers.ts                → Helper functions
│   │   ├── constants.ts              → App constants
│   │   ├── dateUtils.ts              → Date utilities
│   │   └── firebaseUtils.ts          → Firebase helpers
│   │
│   ├── 📁 context/                   [React Context Providers]
│   │   ├── AuthContext.tsx           → 🔐 Authentication state
│   │   ├── ThemeContext.tsx          → Theme switching
│   │   └── CMSContext.tsx            → Global CMS state
│   │
│   ├── 📁 lib/                       [Library Configurations]
│   │   └── utils.ts                  → cn() helper, etc.
│   │
│   ├── 📁 styles/                    [Global Styles]
│   │   ├── globals.css               → Global CSS
│   │   └── tailwind.css              → Tailwind imports
│   │
│   ├── App.tsx                       → Main App with routing
│   ├── main.tsx                      → Entry point
│   └── vite-env.d.ts
│
├── .env.example                      📝 Environment variables template
├── .env.local                        🔒 Local environment variables
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── components.json                   [Shadcn/UI configuration]
└── README.md
```

---

## 🆕 NEW FILES TO CREATE FOR AUTHENTICATION

### 1. `src/config/admin.config.ts`
```typescript
// Static admin credentials for localhost CMS
export const ADMIN_CONFIG = {
  credentials: {
    email: "admin@techlaunch.com",
    password: "TechLaunch@2024!"  // Change this!
  },
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in ms
  storageKey: "techlaunch_admin_session"
};
```

---

### 2. `src/types/auth.types.ts`
```typescript
export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
  loginTime: number;
}

export interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}
```

---

### 3. `src/services/auth.service.ts`
```typescript
import { ADMIN_CONFIG } from "@/config/admin.config";
import { AdminUser, LoginCredentials } from "@/types/auth.types";

class AuthService {
  private storageKey = ADMIN_CONFIG.storageKey;

  // Login with static credentials
  login(credentials: LoginCredentials): boolean {
    const { email, password } = credentials;
    const { credentials: adminCreds } = ADMIN_CONFIG;

    if (email === adminCreds.email && password === adminCreds.password) {
      const session: AdminUser = {
        email,
        isAuthenticated: true,
        loginTime: Date.now()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(session));
      return true;
    }
    return false;
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Check if session is valid
  getSession(): AdminUser | null {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return null;

    try {
      const session: AdminUser = JSON.parse(stored);
      
      // Check if session expired
      const elapsed = Date.now() - session.loginTime;
      if (elapsed > ADMIN_CONFIG.sessionTimeout) {
        this.logout();
        return null;
      }

      return session;
    } catch {
      this.logout();
      return null;
    }
  }

  // Check authentication status
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}

export const authService = new AuthService();
```

---

### 4. `src/context/AuthContext.tsx`
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services/auth.service";
import { AdminUser, AuthContextType, LoginCredentials } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    const session = authService.getSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const success = authService.login(credentials);
      
      if (success) {
        setUser(authService.getSession());
        return true;
      } else {
        setError("Invalid email or password");
        return false;
      }
    } catch (err) {
      setError("An error occurred during login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
```

---

### 5. `src/hooks/useAuth.ts`
```typescript
import { useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  return useAuthContext();
};
```

---

### 6. `src/components/auth/ProtectedRoute.tsx`
```typescript
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

---

### 7. `src/components/auth/LoginForm.tsx`
```typescript
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login({ email, password, rememberMe });
    
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@techlaunch.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(!!checked)}
        />
        <Label htmlFor="remember" className="text-sm cursor-pointer">
          Remember me
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};
```

---

### 8. `src/components/auth/LogoutButton.tsx`
```typescript
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};
```

---

### 9. `src/pages/auth/LoginPage.tsx`
```typescript
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">TechLaunch CMS</CardTitle>
          <CardDescription>Sign in to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};
```

---

### 10. `src/pages/auth/UnauthorizedPage.tsx`
```typescript
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <ShieldX className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        You don't have permission to access this page.
      </p>
      <Button onClick={() => navigate("/login")}>
        Go to Login
      </Button>
    </div>
  );
};
```

---

### 11. Updated `src/App.tsx`
```typescript
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { UnauthorizedPage } from "@/pages/auth/UnauthorizedPage";

// Protected Pages
import Dashboard from "@/pages/Dashboard";
// ... import other pages

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Add more protected routes here */}
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 - Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
```

---

## 📋 IMPLEMENTATION CHECKLIST

| # | File | Action | Priority |
|---|------|--------|----------|
| 1 | `src/config/admin.config.ts` | Create | 🔴 High |
| 2 | `src/types/auth.types.ts` | Create | 🔴 High |
| 3 | `src/services/auth.service.ts` | Create | 🔴 High |
| 4 | `src/context/AuthContext.tsx` | Create | 🔴 High |
| 5 | `src/hooks/useAuth.ts` | Create | 🔴 High |
| 6 | `src/components/auth/ProtectedRoute.tsx` | Create | 🔴 High |
| 7 | `src/components/auth/LoginForm.tsx` | Create | 🔴 High |
| 8 | `src/components/auth/LogoutButton.tsx` | Create | 🟡 Medium |
| 9 | `src/pages/auth/LoginPage.tsx` | Create | 🔴 High |
| 10 | `src/pages/auth/UnauthorizedPage.tsx` | Create | 🟡 Medium |
| 11 | `src/App.tsx` | Update | 🔴 High |
| 12 | `src/components/layout/Header.tsx` | Update (add logout) | 🟡 Medium |

---

## 🔐 DEFAULT ADMIN CREDENTIALS

```
Email:    admin@techlaunch.com
Password: TechLaunch@2024!
```

⚠️ **Change these in `src/config/admin.config.ts` before deploying!**