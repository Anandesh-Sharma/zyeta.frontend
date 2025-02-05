import { useRecoilCallback, useRecoilValue, useRecoilState } from 'recoil';
import { conversationAtomFamily, conversationIdsState, currentConversationIdState } from '../store/conversations/atoms';
import { currentConversationState } from '../store/conversations/selectors';
import { Conversation, APIConversation } from '@/lib/types';
import { DEFAULT_ASSISTANT } from '../constants/chat';
import { useNetwork } from './use-network';
import { useChatSessions } from './use-chat-sessions';
import { useMessages } from './use-messages';
import OrgState from '../store/organization/org-state';
import { chatSessionsByConversationFamily } from '../store/chat-sessions/atoms';
import { llmModelsState } from '../store/assistants/atoms';

// Cache duration for conversations (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function useConversations() {
  const conversationIds = useRecoilValue(conversationIdsState);
  const currentConversation = useRecoilValue(currentConversationState);
  const models = useRecoilValue(llmModelsState);
  const { makeRequest } = useNetwork();
  const { createChatSession, fetchSessionsWithConversation } = useChatSessions();
  const { fetchMessages } = useMessages();

  const fetchConversations = useRecoilCallback(({ set }) => async (forceRefresh = false) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      console.warn('No organization ID available');
      return [];
    }

    try {
      const response = await makeRequest<APIConversation[]>(
        `/api/conversation/list?org_id=${orgId}`,
        { 
          cacheDuration: CACHE_DURATION,
          forceRefresh
        }
      );

      const conversations = response.map<Conversation>(apiConv => ({
        id: apiConv.id,
        title: apiConv.title || 'New Chat',
        model: DEFAULT_ASSISTANT.id,
        timestamp: new Date(apiConv.created_at).getTime(),
      }));

      set(conversationIdsState, conversations.map(conv => conv.id));
      conversations.forEach(conv => {
        set(conversationAtomFamily(conv.id), conv);
      });

      return conversations;
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      return [];
    }
  });

  const createNewConversation = useRecoilCallback(({ set }) => async (modelId?: string) => {
    // Use first available model or default
    const defaultModel = modelId || models[0]?.id || DEFAULT_ASSISTANT.id;

    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    try {
      const response = await makeRequest<APIConversation>(
        `/api/conversation/create?org_id=${orgId}`,
        {
          method: 'POST',
          body: {
            title: 'New Chat'
          }
        }
      );

      const newConversation: Conversation = {
        id: response.id,
        title: response.title || 'New Chat',
        model: defaultModel,
        timestamp: new Date(response.created_at).getTime(),
      };

      // Create chat session first
      const chatSession = await createChatSession({
        conversation_id: newConversation.id,
        model_id: defaultModel
      });

      // Initialize chat sessions with the new session
      set(chatSessionsByConversationFamily(newConversation.id), [chatSession]);

      // Update local state
      set(conversationAtomFamily(newConversation.id), newConversation);
      set(conversationIdsState, (prev) => [newConversation.id, ...prev]);
      set(currentConversationIdState, newConversation.id);

      return newConversation;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      throw err;
    }
  });

  const updateConversation = useRecoilCallback(({ set }) => (conversationId: string, updates: Partial<Conversation>) => {
    set(conversationAtomFamily(conversationId), (prevConversation) => ({ ...prevConversation, ...updates }));
  });

  const deleteConversation = useRecoilCallback(({ set, snapshot }) => async (conversationId: string) => {
    const currentIds = await snapshot.getPromise(conversationIdsState);
    
    if (currentIds.length <= 1) return;

    const newIds = currentIds.filter(id => id !== conversationId);
    set(conversationIdsState, newIds);
    
    const currentId = await snapshot.getPromise(currentConversationIdState);
    if (currentId === conversationId) {
      const currentIndex = currentIds.indexOf(conversationId);
      const nextId = currentIds[currentIndex + 1] || currentIds[currentIndex - 1];
      set(currentConversationIdState, nextId);
    }
  });

  const setCurrentConversationId = useRecoilCallback(({ set }) => async (id: string) => {
    set(currentConversationIdState, id);
    
    // Fetch both sessions and messages when selecting a conversation
    await Promise.all([
      fetchSessionsWithConversation(id),
      fetchMessages(id)
    ]);
  });

  return {
    conversationIds,
    currentConversation,
    createNewConversation,
    updateConversation,
    deleteConversation,
    setCurrentConversationId,
    fetchConversations,
  };
}