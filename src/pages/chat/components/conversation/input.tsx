import React, { useCallback } from 'react';
import { Send } from 'lucide-react';
import { useMessages } from '@/lib/hooks/use-messages';
import { useState, useRef } from 'react';
import { useConversations } from '@/lib/hooks/use-conversations';
import { useSelectedAssistant } from '@/lib/hooks/use-chat-sessions';

export function ConversationInput() {
  const [message, setMessage] = useState('');
  const {getCurrentConversation} = useConversations();
  const { sendMessage } = useMessages();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const assistant = useSelectedAssistant();
  const modelName = assistant?.name; 

  const handleSendMessage = useCallback(() => {
    const currentConversation = getCurrentConversation();
    if (message.trim() && assistant && currentConversation) {
      sendMessage(currentConversation.id, assistant.name, message);
      setMessage('');
      textareaRef.current?.focus();
    }
  }, [message, getCurrentConversation, sendMessage]);


  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && assistant) {
        handleSendMessage();
      }
    }
  }, [message, assistant, handleSendMessage]);

  return (
    <div className="p-4 border-t border-border bg-background">
      <div className="max-w-3xl mx-auto relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={assistant ? `Message ${modelName}...` : 'No active session. Please select or create a new session.'}
          className="w-full rounded-lg bg-muted border-0 px-4 py-3 pr-12 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[80px] resize-none"
          style={{ maxHeight: '200px' }}
          disabled={!assistant}
        />
        <button 
          onClick={handleSendMessage}
          className="absolute right-2 bottom-2 p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim() || !assistant}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}