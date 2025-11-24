import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbNavProps {
  isSidebarHidden?: boolean;
  className?: string;
}

export default function BreadcrumbNav({ isSidebarHidden = false, className }: BreadcrumbNavProps) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map route segments to readable labels
  const labelMap: Record<string, string> = {
    courses: 'Courses',
    modules: 'Modules',
    lessons: 'Lessons',
    quizzes: 'Quizzes',
    assessments: 'Assessments',
    users: 'Users',
    leaderboard: 'Leaderboard',
    achievements: 'Achievements',
    'daily-problems': 'Daily Problems',
    feedback: 'Feedback',
    analytics: 'Analytics',
    settings: 'Settings',
    create: 'Create',
    edit: 'Edit',
    details: 'Details',
  };

  const breadcrumbs: BreadcrumbItem[] = pathnames.map((segment, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return { label, path };
  });

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'flex items-center space-x-2 text-sm mb-6 transition-all duration-300 ease-in-out',
        isSidebarHidden ? 'ml-0' : '',
        className
      )}
      aria-label="Breadcrumb"
    >
      {/* Home Link */}
      <Link
        to="/"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {/* Breadcrumb Items */}
      {breadcrumbs.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={breadcrumb.path} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground">{breadcrumb.label}</span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
