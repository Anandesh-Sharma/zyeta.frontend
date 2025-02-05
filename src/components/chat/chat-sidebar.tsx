import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/lib/types';

interface ChatSidebarProps {
  chats: Conversation[];
  currentChat: Conversation | null;
  onSelectChat: (chat: Conversation) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatSidebar({ 
  chats, 
  currentChat, 
  onSelectChat, 
  onNewChat,
  onDeleteChat 
}: ChatSidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={cn(
              'w-full flex items-center gap-2 px-4 py-2 text-sm text-left group hover:bg-muted/50 transition-colors',
              currentChat?.id === chat.id && 'bg-muted'
            )}
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 truncate">{chat.title}</span>
            {currentChat?.id === chat.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}