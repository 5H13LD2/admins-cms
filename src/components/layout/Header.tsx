import { Search, Bell, User, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { useCMS } from '@/context/CMSContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useCMS();

  return (
    <header className="bg-card border-b border-border px-6 py-4 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-xl gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="-ml-2">
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
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
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
