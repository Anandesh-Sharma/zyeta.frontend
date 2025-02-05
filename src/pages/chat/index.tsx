import { useUI } from '@/lib/hooks/use-ui';
// import { CommandMenu } from '@/components/search/command-menu';
import { memo, useCallback } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { currentConversationState } from '@/lib/store/conversations/selectors';
import { useConversations } from '@/lib/hooks/use-conversations';
import { activeSessionIdByConversationFamily } from '@/lib/store/chat-sessions/atoms';
import {
  ConversationList,
  ConversationHeader,
  ConversationMessages,
  ConversationDetails,
  ConversationInput
} from './components/conversation';

interface ChatPageProps {
  onOpenSearch: () => void;
}

export const ChatPage = memo(({ onOpenSearch }: ChatPageProps) => {
  const { ui, toggleSidebar, toggleDetailsPanel, toggleSearch } = useUI();
  const currentConversation = useRecoilValue(currentConversationState);
  const { updateConversation } = useConversations();
  const [activeSessionId, setActiveSessionId] = useRecoilState(
    currentConversation 
      ? activeSessionIdByConversationFamily(currentConversation.id)
      : activeSessionIdByConversationFamily('')
  );

  const handleUpdateConversation = useCallback((updates: Partial<typeof currentConversation>) => {
    if (currentConversation) {
      updateConversation(currentConversation.id, updates);
    }
  }, [currentConversation, updateConversation]);

  const handleSelectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, [setActiveSessionId]);

  if (!currentConversation) return null;

  return (
    <div className="fixed inset-0 bg-background pl-[56px] flex">
      <ConversationList
        onOpenSearch={onOpenSearch}
        isSidebarOpen={ui.isSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ConversationHeader
          modelId={currentConversation.model}
          conversationId={currentConversation.id}
          isSidebarOpen={ui.isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onOpenSearch={onOpenSearch}
          onToggleDetails={toggleDetailsPanel}
          onSelectSession={handleSelectSession}
        />

        <div className="flex-1 overflow-y-auto min-h-0">
          <ConversationMessages
            conversationId={currentConversation.id}
            modelId={currentConversation.model}
          />
        </div>

        <ConversationInput
          conversationId={currentConversation.id}
          modelId={currentConversation.model}
        />
      </div>

      <ConversationDetails
        conversation={currentConversation}
        isOpen={ui.isDetailsPanelOpen}
        onClose={toggleDetailsPanel}
        onUpdateConversation={handleUpdateConversation}
      />

      {/* <CommandMenu
        isOpen={ui.isSearchOpen}
        onClose={toggleSearch}
      /> */}
    </div>
  );
});

ChatPage.displayName = 'ChatPage';