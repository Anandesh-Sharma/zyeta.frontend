import { memo, useRef, useEffect, useCallback, useMemo } from 'react';
import { getAssistant } from '@/lib/constants/chat';
import { ChatMessage } from '../message';
import { useMessages } from '@/lib/hooks/use-messages';
import { useRecoilValue } from 'recoil';
import { messagesByChatAtom, isLoadingMessagesState } from '@/lib/store/messages/atoms';
import { llmModelsState } from '@/lib/store/assistants/atoms';
import { LoadingPlaceholder } from '@/components/ui/loading-placeholder';
import { 
  activeSessionIdByConversationFamily, 
  chatSessionsByConversationFamily,
  selectedSessionIdByConversationFamily 
} from '@/lib/store/chat-sessions/atoms';

interface ConversationMessagesProps {
  conversationId: string;
  modelId: string;
}

export const ConversationMessages = memo(({ conversationId, modelId }: ConversationMessagesProps) => {
  const messages = useRecoilValue(messagesByChatAtom(conversationId));
  const isLoading = useRecoilValue(isLoadingMessagesState(conversationId));
  const models = useRecoilValue(llmModelsState);
  const activeSessionId = useRecoilValue(activeSessionIdByConversationFamily(conversationId));
  const selectedSessionId = useRecoilValue(selectedSessionIdByConversationFamily(conversationId));
  const sessions = useRecoilValue(chatSessionsByConversationFamily(conversationId));
  const { regenerateResponse } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const assistant = getAssistant(modelId);
  const Icon = assistant.icon;

  // Get active session for model name
  const activeSession = useMemo(() => 
    sessions.find(s => s.status === 'active'),
    [sessions]
  );

  // Filter messages based on selected session
  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    // Show all messages when 'all' is selected
    if (selectedSessionId === 'all') return messages;
    // Otherwise filter by selected session
    return messages.filter(msg => msg.sessionId === selectedSessionId);
  }, [messages, selectedSessionId]);

  // Memoize model name to prevent unnecessary re-renders
  const modelName = useMemo(() => {
    if (activeSession) {
      return activeSession.model_name;
    }
    const model = models.find(m => m.id === modelId);
    return model?.name || assistant?.name || 'Assistant';
  }, [models, modelId, assistant, activeSession]);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      const behavior = filteredMessages.some(m => m.streaming) ? 'auto' : 'smooth';
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, [filteredMessages]);

  useEffect(() => {
    if (filteredMessages.length) {
      scrollToBottom();
    }
  }, [filteredMessages.length, scrollToBottom]);

  const handleRegenerate = useCallback((messageId: string) => {
    regenerateResponse(conversationId, messageId, modelId);
  }, [conversationId, modelId, regenerateResponse]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <LoadingPlaceholder className="h-[100px]" />
          <LoadingPlaceholder className="h-[120px]" />
          <LoadingPlaceholder className="h-[80px]" />
        </div>
      </div>
    );
  }

  if (!activeSessionId) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <Icon className="h-12 w-12 mx-auto" />
          <h2 className="text-xl font-medium text-foreground">No Active Session</h2>
          <p className="text-sm max-w-sm">Select a session to view messages</p>
        </div>
      </div>
    );
  }

  if (!filteredMessages.length) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <Icon className="h-12 w-12 mx-auto" />
          <h2 className="text-xl font-medium text-foreground">{modelName}</h2>
          <p className="text-sm max-w-sm">{assistant.description || 'AI Language Model'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {filteredMessages.map((msg) => (
        <ChatMessage 
          key={msg.id} 
          message={msg} 
          onRegenerate={() => handleRegenerate(msg.id)}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
});

ConversationMessages.displayName = 'ConversationMessages';