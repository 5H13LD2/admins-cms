import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BookMarked,
  HelpCircle,
  Users,
  Trophy,
  Award,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: FileText, label: 'Modules', path: '/modules' },
  { icon: BookMarked, label: 'Lessons', path: '/lessons' },
  { icon: HelpCircle, label: 'Quizzes', path: '/quizzes' },
  { icon: Code2, label: 'Assessments', path: '/assessments' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
  { icon: Award, label: 'Achievements', path: '/achievements' },
  { icon: Calendar, label: 'Daily Problems', path: '/daily-problems' },
  { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn("w-64 bg-card border-r border-border h-full overflow-y-auto transition-all duration-300", className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary truncate">TechLaunch</h1>
        <p className="text-sm text-muted-foreground truncate">CMS Dashboard</p>
      </div>

      <nav className="px-3 pb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors whitespace-nowrap",
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5 min-w-[1.25rem]" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
