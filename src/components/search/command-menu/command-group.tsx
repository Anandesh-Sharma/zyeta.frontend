import { memo } from 'react';
import { CommandGroup } from './types';
import { CommandItemComponent } from './command-item';

interface CommandGroupProps {
  group: CommandGroup;
  selectedIndex: number;
  startIndex: number;
  showStartChat?: boolean;
  onSelect: (index: number) => void;
}

export const CommandGroupComponent = memo(({ 
  group, 
  selectedIndex, 
  startIndex,
  showStartChat,
  onSelect 
}: CommandGroupProps) => {
  if (group.items.length === 0) return null;

  return (
    <div>
      <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
        {group.title}
      </div>
      {group.items.map((item, index) => {
        const absoluteIndex = startIndex + index;
        return (
          <CommandItemComponent
            key={item.id}
            item={item}
            isSelected={selectedIndex === absoluteIndex}
            showStartChat={showStartChat}
            onClick={() => onSelect(absoluteIndex)}
          />
        );
      })}
    </div>
  );
});

CommandGroupComponent.displayName = 'CommandGroup';