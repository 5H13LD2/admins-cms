import { Bell, User, Moon, Sun, Menu, MessageSquare, LogOut, Settings as SettingsIcon, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { useCMS } from '@/context/CMSContext';
import { useFeedbackNotifications } from '@/hooks/useFeedbackNotifications';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/components/auth/AuthProvider';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useCMS();
  const { unreadCount, recentFeedback } = useFeedbackNotifications();
  const navigate = useNavigate();
  const { user, signOut, userRole } = useAuthContext();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <header className="bg-card border-b-2 border-l-2 border-border px-6 py-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="-ml-2">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-foreground">
              {getGreeting()}, {user?.displayName || user?.email?.split('@')[0] || 'User'}! 👋
            </h2>
            <p className="text-sm text-muted-foreground">Welcome back to your dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>New Feedback</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary">{unreadCount} new</Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {recentFeedback.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No new feedback
                </div>
              ) : (
                <>
                  {recentFeedback.map((feedback) => (
                    <DropdownMenuItem
                      key={feedback.id}
                      className="cursor-pointer p-3"
                      onClick={() => navigate('/feedback')}
                    >
                      <div className="flex gap-3 w-full">
                        <div className="flex-shrink-0 mt-1">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium truncate">
                              {feedback.username}
                            </p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimeAgo(feedback.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {feedback.feedback}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-center justify-center text-primary"
                    onClick={() => navigate('/feedback')}
                  >
                    View all feedback
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="border-border"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  {userRole && (
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {userRole}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
