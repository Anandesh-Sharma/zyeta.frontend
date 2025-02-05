import { Plus, Search, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecoilValue } from 'recoil';
import { sortedConversationsState, currentConversationState } from '@/lib/store/conversations/selectors';
import { getAssistant } from '@/lib/constants/chat';
import { Conversation } from '@/lib/types';
import { useCallback, useState } from 'react';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Button } from '@/components/ui/button';
import { useConversations } from '@/lib/hooks/use-conversations';

interface ConversationListProps {
  onOpenSearch: () => void;
  isSidebarOpen: boolean;
}

export function ConversationList({ onOpenSearch, isSidebarOpen }: ConversationListProps) {
  const conversations = useRecoilValue(sortedConversationsState);
  const currentConversation = useRecoilValue(currentConversationState);
  const { createNewConversation, deleteConversation, setCurrentConversationId } = useConversations();
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  
  const handleDeleteConversation = useCallback((e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (conversations.length > 1) {
      setConversationToDelete(conversationId);
    }
  }, [conversations.length]);

  const handleNewChat = async () => {
    if (isCreatingChat) return;
    setIsCreatingChat(true);
    try {
      await createNewConversation();
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (!currentConversation) return null;

  return (
    <>
      <div className={cn(
        "w-[264px] border-r border-border flex flex-col transition-all duration-200 ease-in-out bg-background",
        !isSidebarOpen && "-ml-[264px]"
      )}>
        {/* Search Header */}
        <div className="h-12 flex items-center px-2 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            icon={Search}
            onClick={onOpenSearch}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            Search chats...
            <kbd className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </Button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {/* New Chat Button */}
          <div className="p-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleNewChat}
              disabled={isCreatingChat}
              className="w-full justify-start font-medium"
            >
              {isCreatingChat ? 'Creating...' : 'New Chat'}
            </Button>
          </div>

          {/* Conversations */}
          <div className="px-2 space-y-0.5">
            {conversations.map((conversation) => {
              const assistant = getAssistant(conversation.model);
              const Icon = assistant.icon;
              const isActive = currentConversation.id === conversation.id;
              
              return (
                <div
                  key={conversation.id}
                  onClick={() => setCurrentConversationId(conversation.id)}
                  className={cn(
                    'group relative w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-pointer transition-all duration-200',
                    isActive 
                      ? 'bg-accent text-accent-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm'
                  )}
                >
                  <div className={cn(
                    "h-5 w-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0",
                    isActive 
                      ? 'text-accent-foreground' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="truncate flex-1 text-left">{conversation.title || 'New Chat'}</span>

                  {conversations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                      className={cn(
                        "h-6 w-6 p-0 opacity-0 transition-opacity flex-shrink-0",
                        "group-hover:opacity-100",
                        "hover:bg-background/50 hover:text-foreground",
                        isActive && "hover:bg-accent-foreground/10"
                      )}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={conversationToDelete !== null}
        onClose={() => setConversationToDelete(null)}
        onConfirm={() => {
          if (conversationToDelete) {
            deleteConversation(conversationToDelete);
          }
        }}
        title="Delete Chat"
        description="Are you sure you want to delete this chat? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}