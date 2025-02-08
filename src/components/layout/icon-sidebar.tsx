import { useState } from 'react';
import { MessageCircle, CreditCard, Inbox, BookOpen, BarChart2, MessageSquare, Users, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from '@/components/ui/tooltip';
import { OrgSwitcher } from '@/components/organization/org-switcher';

export const ICON_NAV = [
  { icon: MessageCircle, href: '/chat', showSidebar: false, name: 'Chat' },
  { icon: Store, href: '/agent-store', showSidebar: true, name: 'Agent Store' },
  { icon: CreditCard, href: '/billing', showSidebar: true, name: 'Billing' },
  { icon: Inbox, href: '/inbox', showSidebar: true, name: 'Inbox' },
  { icon: BookOpen, href: '/knowledge', showSidebar: false, name: 'Knowledge Base' },
  { icon: BarChart2, href: '/reports', showSidebar: true, name: 'Reports' },
  { icon: MessageSquare, href: '/outbound', showSidebar: true, name: 'Outbound' },
  { icon: Users, href: '/contacts', showSidebar: true, name: 'Contacts' },
] as const;

export function IconSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside className="fixed left-0 top-0 h-full w-[56px] bg-background border-r border-border flex flex-col items-center py-3 z-50">
      <div className="mb-6">
        <OrgSwitcher />
      </div>
      
      <nav className="flex-1 w-full px-2 space-y-2">
        {ICON_NAV.map(({ icon: Icon, href, name }) => (
          <div 
            key={href} 
            className="relative"
            onMouseEnter={() => setHoveredItem(href)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              to={href}
              className={cn(
                'h-10 w-full rounded-lg flex items-center justify-center relative transition-colors',
                currentPath.startsWith(href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
            <Tooltip 
              content={name} 
              isVisible={hoveredItem === href}
            />
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-2 w-full px-2">
        <div 
          className="relative"
          onMouseEnter={() => setHoveredItem('theme')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <ThemeToggle />
          <Tooltip 
            content="Change theme" 
            isVisible={hoveredItem === 'theme'}
          />
        </div>
      </div>
    </aside>
  );
}