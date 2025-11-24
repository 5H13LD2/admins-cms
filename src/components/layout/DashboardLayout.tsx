import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { useTheme } from '@/context/ThemeContext';
import { CMSProvider, useCMS } from '@/context/CMSContext';
import { cn } from '@/lib/utils';

function DashboardContent() {
  const { theme } = useTheme();
  const { isSidebarHidden } = useCMS();

  return (
    <div
      className={cn(
        'flex h-screen transition-colors',
        theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-muted/40 text-gray-900',
      )}
      data-theme={theme}
    >
      <Sidebar className={cn(isSidebarHidden ? '-ml-64' : '')} />
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <BreadcrumbNav isSidebarHidden={isSidebarHidden} />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <CMSProvider>
      <DashboardContent />
    </CMSProvider>
  );
}
