import { memo } from 'react';
import { Command, ArrowUp, ArrowDown } from 'lucide-react';

export const CommandFooter = memo(() => {
  return (
    <div className="flex items-center justify-between px-2 py-2 border-t border-border bg-muted/50">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ArrowUp className="h-3 w-3" />
          <ArrowDown className="h-3 w-3" />
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-1">
          <Command className="h-3 w-3" />
          <span>Select</span>
        </div>
      </div>
    </div>
  );
});

CommandFooter.displayName = 'CommandFooter';