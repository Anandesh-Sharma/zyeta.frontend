import { Search, MessageSquare } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { filteredAssistantsState } from '@/lib/store/assistants/selectors';
import { AssistantFilter } from './assistant-filter';
import { AssistantCard } from './assistant-card';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useLLM } from '@/lib/hooks/use-llm';
import { useChatSessions, useSelectedAssistant } from '@/lib/hooks/use-chat-sessions';
import { useRecoilCallback } from 'recoil';
import { currentConversationState } from '@/lib/store/conversations/selectors';

interface AssistantSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantSelector({ isOpen, onClose }: AssistantSelectorProps) {
  const filteredAssistants = useRecoilValue(filteredAssistantsState);
  const assistant = useSelectedAssistant();
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>(assistant?.id ?? '');
  const { isLoading } = useLLM();
  const { createChatSession } = useChatSessions();

  const handleStartChat = useRecoilCallback(({ snapshot }) => async () => {
    try {
      // Get current conversation
      const currentConversation = await snapshot.getPromise(currentConversationState);
      if (!currentConversation) {
        throw new Error('No active conversation');
      }

      // Create a new chat session for the current conversation
      await createChatSession({
        conversation_id: currentConversation.id,
        model_id: selectedAssistantId
      });

      onClose();
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  }, [selectedAssistantId]);

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button icon={MessageSquare} onClick={handleStartChat}>
        Start Chat
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      className="h-[85vh]"
      footer={footer}
    >
      <div className="flex h-full overflow-hidden">
        {/* Left Sidebar - Fixed */}
        <div className="w-64 border-r border-border bg-card flex-shrink-0">
          <div className="h-full p-4">
            <AssistantFilter />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Fixed Header */}
          <div className="flex-shrink-0 border-b border-border bg-background">
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-medium">Select Assistant</h1>
                <p className="text-sm text-muted-foreground">Choose an AI assistant to chat with</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search assistants..."
                    className="w-64 h-9 pl-9 pr-3 rounded-md bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>]
                </kbd>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading available models...
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {filteredAssistants.map(assistant => (
                    <AssistantCard
                      key={assistant.id}
                      assistant={{
                        ...assistant,
                        rating: 0,
                        usageCount: undefined,
                        tags: ['Core'],
                        credits: 'Included',
                      }}
                      isSelected={selectedAssistantId === assistant.id}
                      onSelect={() => setSelectedAssistantId(assistant.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}