import { Sidebar } from './sidebar';
import { Header } from './header';
import { useLocation } from 'react-router-dom';
import { ICON_NAV } from './icon-sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation();
  const currentRoute = ICON_NAV.find(item => pathname.startsWith(item.href)) || ICON_NAV[0];
  const showSidebar = currentRoute.showSidebar ?? true; // Default to showing sidebar

  return (
    <div className="min-h-screen bg-background">
      {showSidebar && <Sidebar />}
      
      <div
        className={cn(
          "ml-[56px] min-h-screen transition-all duration-200",
          showSidebar && "ml-[320px]"
        )}
      >
        <Header />
        <main className="p-2">
          {children}
        </main>
      </div>
    </div>
  );
}