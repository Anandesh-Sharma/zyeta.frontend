import type { Message, APIMessage, APIMessageResponse } from '@/lib/types';

import { useRecoilCallback, useRecoilValue } from 'recoil';
import { messagesByConversationFamily, isLoadingMessagesConversationFamily, isRespondingConversationFamily } from '@/lib/store/messages';

import { v4 as uuidv4 } from 'uuid';
import { useCallback, useMemo } from 'react';
import { useNetwork } from '@/lib/hooks/use-network';
import OrgState from '@/lib/store/organization/org-state';
import { selectedSessionByConversationState } from '@/lib/store/chat-sessions';

const MESSAGES_LIMIT = 20;

export function useMessages(conversationId?: string) {
  const isResponding = conversationId ? useRecoilValue(isRespondingConversationFamily(conversationId)) : false;
  const isLoading = conversationId ? useRecoilValue(isLoadingMessagesConversationFamily(conversationId)) : false;
  
  const { makeStreamRequest, makeRequest } = useNetwork();

  const fetchMessages = useRecoilCallback(({ set }) => async (conversationId: string, offset = 0) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    try {
      // Set loading state
      set(isLoadingMessagesConversationFamily(conversationId), true);
      
      const response = await makeRequest<APIMessageResponse>(
        `/conversation/messages?org_id=${orgId}&conversation_id=${conversationId}&limit=${MESSAGES_LIMIT}&offset=${offset}`
      );

      // Convert API messages to our Message format
      const messages = response.messages.map(convertAPIMessage);

      // Set messages in state
      set(messagesByConversationFamily(conversationId), messages);

      return {
        messages,
        total: response.total,
        hasMore: response.has_more
      };
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Set empty array to indicate error state
      set(messagesByConversationFamily(conversationId), []);
      throw error;
    } finally {
      // Clear loading state
      set(isLoadingMessagesConversationFamily(conversationId), false);
    }
  }, []);

  const sendMessage = useRecoilCallback(({ set, snapshot }) => async (conversationId: string, content: string) => {
    const selectedSession = await snapshot.getPromise(selectedSessionByConversationState(conversationId));
    if (!selectedSession) {
      throw new Error('No active chat session found');
    }

    const {id: sessionId, model_name, model_id} = selectedSession;

    const currentIsResponding = await snapshot.getPromise(isRespondingConversationFamily(conversationId));

    if (currentIsResponding) return;

    const userMessage = createMessage(content, 'user', model_id, sessionId, model_name);
    set(messagesByConversationFamily(conversationId), (prev) => [...(prev || []), userMessage]);

    const aiMessage = createMessage('', 'assistant', model_id, sessionId, model_name);
    set(messagesByConversationFamily(conversationId), (prev) => [...(prev || []), aiMessage]);
    
    try {
      set(isRespondingConversationFamily(conversationId), true);
      await streamResponse(conversationId, aiMessage.id, content, sessionId);
    } finally {
      set(isRespondingConversationFamily(conversationId), false);
    }
  }, []);

  const regenerateResponse = useRecoilCallback(({ set, snapshot }) => async (conversationId: string, messageId: string, model: string) => {
    const selectedSession = await snapshot.getPromise(selectedSessionByConversationState(conversationId));
    if (!selectedSession) {
      throw new Error('No active chat session found');
    }

    const {id: sessionId, model_name, model_id} = selectedSession;

    const currentIsResponding = snapshot.getLoadable(isRespondingConversationFamily(conversationId)).getValue();

    if (currentIsResponding) return;

    const messages = await snapshot.getPromise(messagesByConversationFamily(conversationId));
    if (!messages) return;

    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const lastUserMessage = messages
      .slice(0, messageIndex)
      .reverse()
      .find(m => m.role === 'user');

    if (!lastUserMessage) return;

    try {
      const aiMessage = createMessage('', 'assistant', model_id, sessionId, model_name);
      set(messagesByConversationFamily(conversationId), (prev) => {
        if (!prev) return [aiMessage];
        const filtered = prev.filter(m => m.id !== messageId);
        return [...filtered, aiMessage];
      });
      
      await streamResponse(conversationId, aiMessage.id, lastUserMessage.content, sessionId);
    } finally {
      set(isRespondingConversationFamily(conversationId), false);
    }
  }, []);

  const createMessage = (
    content: string, 
    role: 'user' | 'assistant', 
    model: string,
    sessionId: string,
    modelName: string
  ): Message => ({
    id: uuidv4(),
    content,
    role,
    timestamp: Date.now(),
    model,
    sessionId,
    modelName,
    ...(role === 'assistant' && { status: 'loading' }),
  });

  const streamResponse = useRecoilCallback(({ set }) => async (conversationId: string, messageId: string, userMessage: string, chatSessionId: string) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    set(messagesByConversationFamily(conversationId), (prev) =>
      prev?.map(msg => msg.id === messageId ? { ...msg, status: undefined, streaming: true } : msg) || []
    );

    let currentContent = '';

    try {
      await makeStreamRequest(
        `/conversation/stream_chat?org_id=${orgId}`,
        {
          method: 'POST',
          body: {
            chat_session_id: chatSessionId,
            message: userMessage,
          },
        },
        (chunk) => {
          currentContent += chunk;
          set(messagesByConversationFamily(conversationId), (prev) =>
            prev?.map(msg => msg.id === messageId ? { ...msg, content: currentContent } : msg) || []
          );
        }
      );
    } catch (error) {
      console.error('Stream error:', error);
      set(messagesByConversationFamily(conversationId), (prev) =>
        prev?.map(msg => msg.id === messageId ? { ...msg } : msg) || []
      );
    } finally {
      set(messagesByConversationFamily(conversationId), (prev) =>
        prev?.map(msg => msg.id === messageId ? { ...msg, streaming: false } : msg) || []
      );
    }
  }, []);

  const convertAPIMessage = useCallback((apiMessage: APIMessage): Message => ({
    id: apiMessage.id,
    content: apiMessage.content,
    role: apiMessage.role === 'USER' ? 'user' : 'assistant',
    timestamp: new Date(apiMessage.created_at).getTime(),
    model: apiMessage.model_id,
    sessionId: apiMessage.chat_session_id,
    modelName: apiMessage.model_name,
    agentName: apiMessage.agent_name,
    tokenUsed: apiMessage.token_used
  }), []);

  return useMemo(() => ({
    sendMessage,
    regenerateResponse,
    fetchMessages,
    isResponding,
    isLoading
  }), [sendMessage, regenerateResponse, fetchMessages, isResponding, isLoading]);
}