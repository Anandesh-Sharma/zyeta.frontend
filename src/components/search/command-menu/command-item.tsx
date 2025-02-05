import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandItem } from './types';

interface CommandItemProps {
  item: CommandItem;
  isSelected: boolean;
  showStartChat?: boolean;
  onClick: () => void;
}

export const CommandItemComponent = memo(({ 
  item, 
  isSelected, 
  showStartChat,
  onClick 
}: CommandItemProps) => {
  const Icon = item.icon;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
        isSelected ? "bg-accent" : "hover:bg-muted"
      )}
    >
      <div className={cn(
        "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
        isSelected ? "bg-background" : "bg-muted"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{item.title}</span>
          {item.shortcut && (
            <kbd className="text-xs text-muted-foreground">{item.shortcut}</kbd>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{item.description}</p>
      </div>
      {showStartChat && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Start chat</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      )}
    </button>
  );
});

CommandItemComponent.displayName = 'CommandItem';