import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          icon={theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor}
          className="w-10"
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          side="right"
          sideOffset={8}
          className="z-50 min-w-[150px] overflow-hidden rounded-md border border-border bg-background p-1 shadow-md animate-in slide-in-from-top-2"
        >
          <DropdownMenu.Item
            onClick={() => setTheme('light')}
            className={cn(
              'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              theme === 'light' && 'bg-accent text-accent-foreground'
            )}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setTheme('dark')}
            className={cn(
              'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              theme === 'dark' && 'bg-accent text-accent-foreground'
            )}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setTheme('system')}
            className={cn(
              'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              theme === 'system' && 'bg-accent text-accent-foreground'
            )}
          >
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}