import React from 'react';
import { BILLING_NAV, AGENT_STORE_NAV } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine which navigation to use based on the current path
  const navigationItems = currentPath.startsWith('/billing') 
    ? BILLING_NAV 
    : currentPath.startsWith('/agent-store')
    ? AGENT_STORE_NAV
    : [];

  return (
    <aside className="fixed left-[56px] top-0 h-full w-[264px] bg-background border-r border-border z-40">
      <div className="h-14 flex items-center px-4 border-b border-border">
        <h2 className="text-sm font-medium">
          {currentPath.startsWith('/billing') ? 'Billing' : 'Agent Store'}
        </h2>
      </div>

      <nav className="py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center h-9 mx-2 px-3 rounded-md text-[13px] transition-colors',
                isActive 
                  ? 'bg-accent text-accent-foreground font-medium' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}