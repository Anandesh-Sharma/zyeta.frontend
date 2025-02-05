import React from 'react';
import { Send } from 'lucide-react';
import { getAssistant } from '@/lib/constants/chat';
import { useMessages } from '@/lib/hooks/use-messages';
import { useRecoilValue } from 'recoil';
import { activeSessionByConversationState } from '@/lib/store/chat-sessions/selectors';
import { useState, useRef } from 'react';

interface ConversationInputProps {
  conversationId: string;
  modelId: string;
}

export function ConversationInput({ conversationId, modelId }: ConversationInputProps) {
  const [message, setMessage] = useState('');
  const activeSession = useRecoilValue(activeSessionByConversationState(conversationId));
  const { sendMessage } = useMessages();
  const assistant = getAssistant(modelId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get model name from active session or fallback to assistant name
  const modelName = React.useMemo(() => 
    activeSession?.model_name || assistant?.name || 'Assistant',
    [activeSession, assistant]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && activeSession) {
        handleSendMessage();
      }
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && activeSession) {
      sendMessage(conversationId, modelId, message);
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      <div className="max-w-3xl mx-auto relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeSession ? `Message ${modelName}...` : 'No active session. Please select or create a new session.'}
          className="w-full rounded-lg bg-muted border-0 px-4 py-3 pr-12 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[80px] resize-none"
          style={{ maxHeight: '200px' }}
          disabled={!activeSession}
        />
        <button 
          onClick={handleSendMessage}
          className="absolute right-2 bottom-2 p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim() || !activeSession}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}