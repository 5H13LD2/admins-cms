# TechLaunch CMS - Quick Setup Guide

## 🚀 Step-by-Step Setup Instructions

### 1. Initialize Project

```bash
# Create new Vite + React + TypeScript project
npm create vite@latest techlaunch-cms -- --template react-ts

# Navigate to project directory
cd techlaunch-cms

# Install dependencies
npm install
```

---

### 2. Install Core Dependencies

```bash
# React Router for navigation
npm install react-router-dom

# Firebase
npm install firebase

# Icons
npm install lucide-react

# Utilities
npm install clsx tailwind-merge

# Date utilities
npm install date-fns
```

---

### 3. Install Development Dependencies

```bash
# Tailwind CSS and PostCSS
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

---

### 4. Setup Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }
}
```

---

### 5. Setup Shadcn/UI

```bash
# Initialize Shadcn/UI
npx shadcn-ui@latest init

# When prompted, choose:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - Global CSS: src/index.css
# - CSS variables: Yes
# - Tailwind config: tailwind.config.js
# - Components: @/components
# - Utils: @/lib/utils

# Install commonly used components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add table
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add skeleton
```

---

### 6. Setup Path Aliases

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

---

### 7. Create Folder Structure

```bash
# Create all necessary directories
mkdir -p src/components/{ui,layout,cards,forms,modals,tables,charts,common}
mkdir -p src/pages/{courses,modules,lessons,quizzes,assessments,users,leaderboard,achievements,daily-problems,feedback,analytics,settings}
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/data
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/context
mkdir -p src/lib
mkdir -p src/styles
```

---

### 8. Setup Firebase

Create `.env.local` file in root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create `src/services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

---

### 9. Create Basic Types

Create `src/types/index.ts`:

```typescript
export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  image?: string;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  duration: string;
  order: number;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface TechnicalAssessment {
  id: string;
  title: string;
  description: string;
  type: 'code_fix' | 'sql_query';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  topic?: string;
  courseId: string;
  brokenCode?: string;
  correctCode?: string;
  sample_table?: {
    name: string;
    columns: string[];
    rows: any[];
  };
  expected_query?: string;
  tags?: string[];
  status: 'active' | 'inactive';
  author?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  lastLogin?: Date;
  status: 'online' | 'offline';
  coursesEnrolled: number;
  totalActivities: number;
  codingChallenges: {
    attempted: number;
    passed: number;
    passRate: number;
  };
  quizzes: {
    attempted: number;
    passed: number;
    passRate: number;
  };
  overallPassRate: number;
}
```

---

### 10. Create Utility Functions

Create `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Create `src/utils/formatters.ts`:

```typescript
export const formatDate = (date: Date | any): string => {
  if (!date) return 'N/A';
  
  let dateObj: Date;
  if (date._seconds) {
    dateObj = new Date(date._seconds * 1000);
  } else if (date.toDate) {
    dateObj = date.toDate();
  } else {
    dateObj = new Date(date);
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};
```

---

### 11. Setup Routing

Create `src/App.tsx`:

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/courses/CoursesPage';
import ModulesPage from './pages/modules/ModulesPage';
import LessonsPage from './pages/lessons/LessonsPage';
import QuizzesPage from './pages/quizzes/QuizzesPage';
import UsersPage from './pages/users/UsersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="modules" element={<ModulesPage />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
```

---

### 12. Create Layout Components

Create `src/components/layout/DashboardLayout.tsx`:

```typescript
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

Create `src/components/layout/Sidebar.tsx`:

```typescript
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Users,
  Trophy,
  Settings,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: FileText, label: 'Modules', path: '/modules' },
  { icon: FileText, label: 'Lessons', path: '/lessons' },
  { icon: HelpCircle, label: 'Quizzes', path: '/quizzes' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">TechLaunch</h1>
        <p className="text-sm text-gray-500">CMS Dashboard</p>
      </div>
      
      <nav className="px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

Create `src/components/layout/Header.tsx`:

```typescript
import { Search, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
```

---

### 13. Create Dashboard Page

Create `src/pages/Dashboard.tsx`:

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, HelpCircle, Award } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-600' },
    { title: 'Courses', value: '156', icon: BookOpen, color: 'text-green-600' },
    { title: 'Quizzes', value: '89', icon: HelpCircle, color: 'text-purple-600' },
    { title: 'Assessments', value: '45', icon: Award, color: 'text-orange-600' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm">
              • User John Doe completed Module: Introduction to Python
            </div>
            <div className="text-sm">
              • New quiz "Advanced JavaScript Concepts" was created
            </div>
            <div className="text-sm">
              • 5 new users registered today
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 14. Copy Existing Card Components

Copy your existing card components to the appropriate folder:

```bash
# Copy your existing components
cp /path/to/ModuleCard.tsx src/components/cards/
cp /path/to/LessonCard.tsx src/components/cards/
cp /path/to/QuizCard.tsx src/components/cards/
cp /path/to/DetailedQuizCard.tsx src/components/cards/
cp /path/to/DetailedAssessmentCard.tsx src/components/cards/
cp /path/to/UserCard.tsx src/components/cards/
```

---

### 15. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your CMS!

---

## 📝 Additional Configuration Files

### `.gitignore`

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.production
```

### `.env.example`

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 🎉 Next Steps

1. **Implement Firebase Services** - Create service files for CRUD operations
2. **Create Custom Hooks** - Build hooks for data fetching
3. **Build Page Components** - Create remaining pages (Courses, Modules, etc.)
4. **Add Forms** - Implement create/edit forms
5. **Setup Authentication** - Add login/logout functionality
6. **Add Charts** - Integrate Recharts for analytics
7. **Optimize Performance** - Add loading states and error handling

---

## 🔗 Useful Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Router v6](https://reactrouter.com/)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 💡 Tips

1. Start with the folder structure first
2. Implement one feature at a time
3. Use dummy data initially, then connect to Firebase
4. Test components individually before integration
5. Keep components small and reusable
6. Use TypeScript for better type safety
7. Follow the DRY principle (Don't Repeat Yourself)

---

Happy coding! 🚀
