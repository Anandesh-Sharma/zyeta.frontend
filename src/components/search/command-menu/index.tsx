import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { COMMANDS } from './constants';
import { CommandGroupComponent } from './command-group';
import { CommandFooter } from './command-footer';
import { CommandItem } from './types';
import { useConversations } from '@/lib/hooks/use-conversations';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (message: string, modelId: string) => void;
  onSelectChat?: (chatId: string) => void;
}

export const CommandMenu = memo(({ isOpen, onClose, onStartChat, onSelectChat }: CommandMenuProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { getConversations } = useConversations()
  // Filter and group commands based on search query
  const filteredAndGroupedCommands = useCallback(() => {
    const searchQuery = query.toLowerCase();
    
    // Filter chats first
    const filteredChats = getConversations()
      .filter(chat => 
        chat.title.toLowerCase().includes(searchQuery)
      )
      .map(chat => {
        // TODO: Get assistant from chat
        const assistant = {
          name: 'Assistant',
          icon: MessageSquare
        };
        return {
          id: chat.id,
          type: 'chat' as const,
          title: chat.title || 'New Chat',
          description: `Chat with ${assistant.name}`,
          icon: assistant.icon || MessageSquare,
          chat
        };
      });

    // Filter regular commands
    const filtered = COMMANDS.filter(command => 
      command.type === 'action' || // Always include actions
      command.title.toLowerCase().includes(searchQuery) ||
      command.description.toLowerCase().includes(searchQuery)
    );

    // Get filtered models and agents
    const models = filtered.filter(c => c.type === 'model');
    const agents = filtered.filter(c => c.type === 'agent');
    const actions = filtered.filter(c => c.type === 'action');

    // If no results found (except actions), show all models and agents
    if (searchQuery && filteredChats.length === 0 && models.length === 0 && agents.length === 0) {
      return {
        chats: { title: 'Chats', items: [] },
        models: { 
          title: 'Start New Chat With', 
          items: COMMANDS.filter(c => c.type === 'model')
        },
        agents: { 
          title: 'Or Use an Agent', 
          items: COMMANDS.filter(c => c.type === 'agent')
        },
        actions: { title: 'Actions', items: actions }
      };
    }

    return {
      chats: { title: 'Chats', items: filteredChats },
      models: { title: 'Models', items: models },
      agents: { title: 'Agents', items: agents },
      actions: { title: 'Actions', items: actions }
    };
  }, [query]);

  const groups = filteredAndGroupedCommands();
  const allItems = [
    ...groups.chats.items,
    ...groups.models.items,
    ...groups.agents.items,
    ...groups.actions.items
  ];

  const handleSelect = useCallback((item: CommandItem) => {
    if (item.type === 'chat' && onSelectChat) {
      onSelectChat(item.id);
      onClose();
    } else if ((item.type === 'model' || item.type === 'agent')) {
      onStartChat(query.trim() || 'New chat', item.id);
      onClose();
    } else if (item.id === 'new-chat') {
      onStartChat(query.trim() || 'New chat', 'gpt-3.5'); // Default to GPT-3.5 for new chats
      onClose();
    }
  }, [query, onStartChat, onSelectChat, onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = allItems[selectedIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  }, [allItems, selectedIndex, handleSelect]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.addEventListener('keydown', handleKeyDown);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="min-w-[600px] overflow-hidden"
    >
      <div className="flex flex-col">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats or type a message to start a new chat..."
            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Command List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {allItems.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p>No results found. Press Enter to start a new chat.</p>
            </div>
          ) : (
            <>
              <CommandGroupComponent
                group={groups.chats}
                selectedIndex={selectedIndex}
                startIndex={0}
                onSelect={(index) => handleSelect(allItems[index])}
              />
              <CommandGroupComponent
                group={groups.models}
                selectedIndex={selectedIndex}
                startIndex={groups.chats.items.length}
                showStartChat={!!query}
                onSelect={(index) => handleSelect(allItems[index])}
              />
              <CommandGroupComponent
                group={groups.agents}
                selectedIndex={selectedIndex}
                startIndex={groups.chats.items.length + groups.models.items.length}
                showStartChat={!!query}
                onSelect={(index) => handleSelect(allItems[index])}
              />
              <CommandGroupComponent
                group={groups.actions}
                selectedIndex={selectedIndex}
                startIndex={groups.chats.items.length + groups.models.items.length + groups.agents.items.length}
                showStartChat={!!query}
                onSelect={(index) => handleSelect(allItems[index])}
              />
            </>
          )}
        </div>

        <CommandFooter />
      </div>
    </Modal>
  );
});

CommandMenu.displayName = 'CommandMenu';