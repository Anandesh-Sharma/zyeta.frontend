import { useRecoilCallback, useRecoilValue } from 'recoil';
import { messagesByConversationAtom, isRespondingState, isLoadingMessagesState } from '../store/messages/atoms';
import { Message, APIMessage, APIMessageResponse } from '@/lib/types/message';
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from 'react';
import { useNetwork } from './use-network';
import OrgState from '../store/organization/org-state';
import { selectedSessionByConversationState } from '../store/chat-sessions/selectors';

const MESSAGES_LIMIT = 20;

export function useMessages(conversationId?: string) {
  const isResponding = conversationId ? useRecoilValue(isRespondingState(conversationId)) : false;
  const isLoading = conversationId ? useRecoilValue(isLoadingMessagesState(conversationId)) : false;
  
  const { makeStreamRequest, makeRequest } = useNetwork();

  const fetchMessages = useRecoilCallback(({ set }) => async (conversationId: string, offset = 0) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    try {
      // Set loading state
      set(isLoadingMessagesState(conversationId), true);
      
      // Clear existing messages while loading
      set(messagesByConversationAtom(conversationId), undefined);

      const response = await makeRequest<APIMessageResponse>(
        `/conversation/messages?org_id=${orgId}&conversation_id=${conversationId}&limit=${MESSAGES_LIMIT}&offset=${offset}`
      );

      // Convert API messages to our Message format
      const messages = response.messages.map(convertAPIMessage);

      // Set messages in state
      set(messagesByConversationAtom(conversationId), messages);

      return {
        messages,
        total: response.total,
        hasMore: response.has_more
      };
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Set empty array to indicate error state
      set(messagesByConversationAtom(conversationId), []);
      throw error;
    } finally {
      // Clear loading state
      set(isLoadingMessagesState(conversationId), false);
    }
  });

  const sendMessage = useRecoilCallback(({ set, snapshot }) => async (conversationId: string, model: string, content: string) => {
    const selectedSession = await snapshot.getPromise(selectedSessionByConversationState(conversationId));
    if (!selectedSession) {
      throw new Error('No active chat session found');
    }

    const {id, model_name} = selectedSession;

    const currentIsResponding = await snapshot.getPromise(isRespondingState(conversationId));

    if (currentIsResponding) return;

    const userMessage = createMessage(conversationId, content, 'user', model, id, model_name);
    set(messagesByConversationAtom(conversationId), (prev) => [...(prev || []), userMessage]);

    const aiMessage = createMessage(conversationId, '', 'assistant', model, id, model_name);
    set(messagesByConversationAtom(conversationId), (prev) => [...(prev || []), aiMessage]);
    
    try {
      set(isRespondingState(conversationId), true);
      await streamResponse(conversationId, aiMessage.id, content, id);
    } finally {
      set(isRespondingState(conversationId), false);
    }
  });

  const regenerateResponse = useRecoilCallback(({ set, snapshot }) => async (conversationId: string, messageId: string, model: string) => {
    const selectedSession = await snapshot.getPromise(selectedSessionByConversationState(conversationId));
    if (!selectedSession) {
      throw new Error('No active chat session found');
    }

    const {id, model_name} = selectedSession;

    const currentIsResponding = snapshot.getLoadable(isRespondingState(conversationId)).getValue();

    if (currentIsResponding) return;

    const messages = await snapshot.getPromise(messagesByConversationAtom(conversationId));
    if (!messages) return;

    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const lastUserMessage = messages
      .slice(0, messageIndex)
      .reverse()
      .find(m => m.role === 'user');

    if (!lastUserMessage) return;

    try {
      const aiMessage = createMessage(conversationId, '', 'assistant', model, id, model_name);
      set(messagesByConversationAtom(conversationId), (prev) => {
        if (!prev) return [aiMessage];
        const filtered = prev.filter(m => m.id !== messageId);
        return [...filtered, aiMessage];
      });
      
      await streamResponse(conversationId, aiMessage.id, lastUserMessage.content, id);
    } finally {
      set(isRespondingState(conversationId), false);
    }
  });

  const createMessage = (
    conversationId: string, 
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

    set(messagesByConversationAtom(conversationId), (prev) =>
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
          set(messagesByConversationAtom(conversationId), (prev) =>
            prev?.map(msg => msg.id === messageId ? { ...msg, content: currentContent } : msg) || []
          );
        }
      );
    } catch (error) {
      console.error('Stream error:', error);
      set(messagesByConversationAtom(conversationId), (prev) =>
        prev?.map(msg => msg.id === messageId ? { ...msg, status: 'error' } : msg) || []
      );
    } finally {
      set(messagesByConversationAtom(conversationId), (prev) =>
        prev?.map(msg => msg.id === messageId ? { ...msg, streaming: false } : msg) || []
      );
    }
  });

  const convertAPIMessage = (apiMessage: APIMessage): Message => ({
    id: apiMessage.id,
    content: apiMessage.content,
    role: apiMessage.role === 'USER' ? 'user' : 'assistant',
    timestamp: new Date(apiMessage.created_at).getTime(),
    model: apiMessage.model_id,
    sessionId: apiMessage.chat_session_id,
    modelName: apiMessage.model_name,
    agentName: apiMessage.agent_name,
    tokenUsed: apiMessage.token_used
  });

  return useMemo(() => ({
    sendMessage,
    regenerateResponse,
    fetchMessages,
    isResponding,
    isLoading
  }), [sendMessage, regenerateResponse, fetchMessages, isResponding, isLoading]);
}