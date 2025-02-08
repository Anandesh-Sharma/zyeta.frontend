import { memo, useRef, useEffect, useCallback, useMemo } from 'react';
import { useMessages, useMessagesAtomFamily } from '@/lib/hooks/use-messages';
import { useConversationSelector } from '@/lib/hooks/use-conversations';
import { LoadingPlaceholder } from '@/components/ui/loading-placeholder';
import { ChatMessage } from '../message';
import { useSelectedAssistant, useSelectedSession } from '@/lib/hooks/use-chat-sessions';

export const ConversationMessages = memo(() => {
  const currentConversation = useConversationSelector('currentConversation', 'get');
  const messages = useMessagesAtomFamily('messagesByConversation', 'get', currentConversation?.id ?? '');
  const isLoading = useMessagesAtomFamily('isLoadingMessagesConversation', 'get', currentConversation?.id ?? '');

  const { regenerateResponse } = useMessages();

  const selectedSession = useSelectedSession();
  
  const assistant = useSelectedAssistant();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('messages', messages)
  // const Icon = assistant?.icon;

  // Filter messages based on selected session
  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    // Show all messages when 'all' is selected
    // if (selectedSessionId === 'all') return messages;
    // Otherwise filter by selected session
    // return messages.filter(msg => msg.sessionId === selectedSessionId);
    return messages;
  }, [messages]);

  // Memoize model name to prevent unnecessary re-renders
  const modelName = assistant?.name

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
    if(assistant) {
      regenerateResponse(currentConversation?.id ?? '', messageId, assistant.id);
    }
  }, [currentConversation?.id, assistant?.name, regenerateResponse]);

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

  if (!selectedSession) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          {/* <Icon className="h-12 w-12 mx-auto" /> */}
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
          {/* <Icon className="h-12 w-12 mx-auto" /> */}
          <h2 className="text-xl font-medium text-foreground">{modelName}</h2>
          <p className="text-sm max-w-sm">{'AI Language Model'}</p>
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