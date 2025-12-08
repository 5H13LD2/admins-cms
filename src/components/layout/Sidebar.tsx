import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
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
  isCollapsed?: boolean;
}

export default function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Determine if sidebar should be expanded (either not collapsed, or collapsed but hovered)
  const isExpanded = !isCollapsed || isHovered;

  return (
    <aside
      className={cn(
        "bg-card border-r-2 border-border h-screen overflow-hidden relative group flex flex-col",
        isExpanded ? "w-64" : "w-16",
        // Only animate width on hover, not on collapse toggle
        isCollapsed && "transition-[width] duration-300 ease-in-out",
        className
      )}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => isCollapsed && setIsHovered(false)}
    >
      {/* Header */}
      <div className={cn(
        "p-6 transition-all duration-300 border-b border-border",
        !isExpanded && "px-3 py-4"
      )}>
        <h1 className={cn(
          "text-2xl font-bold text-primary transition-all duration-300",
          isExpanded ? "opacity-100" : "opacity-0 text-center text-base"
        )}>
          {isExpanded ? 'TechLaunch' : 'TL'}
        </h1>
        <p className={cn(
          "text-sm text-muted-foreground transition-all duration-300 overflow-hidden",
          isExpanded ? "opacity-100 mt-1" : "opacity-0 h-0"
        )}>
          CMS Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "pb-6",
        isExpanded ? "px-3" : "px-2"
      )}>
        <div className="pt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center rounded-lg mb-1 transition-all duration-300 relative group/item",
                  isExpanded ? "gap-3 px-3 py-2.5" : "justify-center px-2 py-2.5",
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5 min-w-[1.25rem] flex-shrink-0" />
                <span className={cn(
                  "font-medium transition-all duration-300 whitespace-nowrap",
                  isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                )}>
                  {item.label}
                </span>

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg border border-border">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
