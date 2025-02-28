import type { Conversation, APIConversation } from '@/lib/types';

import { useRecoilCallback } from 'recoil';
import { v4 } from 'uuid';
import { conversationAtomFamily,
  conversationIdsState,
  currentConversationIdState,
  allConversationsState,
  currentConversationState
} from '@/lib/store/conversations';
import OrgState from '@/lib/store/organization/org-state';
import { conversationSessionsByConversationFamily, selectedSessionIdByConversationFamily } from '@/lib/store/chat-sessions';
import { getTimestamp } from '@/lib/utils';
import { assistantsState } from '@/lib/store/assistants';

import { useNetwork } from '../use-network';
import { useChatSessions } from '../use-chat-sessions';
import { useMessages } from '../use-messages';

// Cache duration for conversations (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function useConversations() {
  const { makeRequest } = useNetwork();
  const { createChatSession, fetchSessionsWithConversation } = useChatSessions();
  const { fetchMessages } = useMessages();

  const getCurrentConversation = useRecoilCallback(({ snapshot }) => () => {
    return snapshot.getLoadable(currentConversationState).getValue();
  }, []);

  const getConversationIds = useRecoilCallback(({ snapshot }) => () => {
    return snapshot.getLoadable(conversationIdsState).getValue();
  }, []);

  const fetchConversations = useRecoilCallback(({ set }) => async (forceRefresh: boolean = false) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      console.warn('No organization ID available');
      return [];
    }

    try {
      const response = await makeRequest<APIConversation[]>(
        `/conversation/list?org_id=${orgId}`,
        { 
          cacheDuration: CACHE_DURATION,
          forceRefresh
        }
      );

      const conversations = response.map(conv => {
        return {
          ...conv,
          timestamp: getTimestamp(conv.created_at),
        };
      });

      set(conversationIdsState, conversations.map(conv => conv.id));

      conversations.forEach(conv => {
        set(conversationAtomFamily(conv.id), conv);
      });

      return conversations;
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      return [];
    }
  }, []);

  const createNewConversation = useRecoilCallback(({ set, snapshot }) => async () => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    try {
      const response = await makeRequest<APIConversation>(
        `/conversation/create?org_id=${orgId}`,
        {
          method: 'POST',
          body: {
            title: v4()
          }
        }
      );

      const newConversation: Conversation = {
        id: response.id,
        title: response.title || 'New Chat',
        timestamp: new Date(response.created_at).getTime(),
      };

      const assistants = snapshot.getLoadable(assistantsState).getValue();

      // Create chat session first
      const chatSession = JSON.parse(JSON.stringify(await createChatSession({
        conversation_id: newConversation.id,
        model_id: assistants[0].id
      })));

      chatSession.status = 'active';

      // Initialize chat sessions with the new session
      set(conversationSessionsByConversationFamily(newConversation.id), [chatSession]);

      // Update local state
      set(conversationAtomFamily(newConversation.id), newConversation);
      set(conversationIdsState, (prev) => [newConversation.id, ...prev]);
      set(currentConversationIdState, newConversation.id);
      set(selectedSessionIdByConversationFamily(newConversation.id), chatSession.id);
      return newConversation;
    } catch (err) {
      console.error('Failed to create conversation:', err);
      throw err;
    }
  }, []);

  const updateConversation = useRecoilCallback(({ set }) => (conversationId: string, updates: Partial<Conversation>) => {
    set(conversationAtomFamily(conversationId), (prevConversation) => ({ ...prevConversation, ...updates }));
  }, []);

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
  }, []);

  const setCurrentConversationId = useRecoilCallback(({ set }) => async (id: string) => {
    set(currentConversationIdState, id);
    
    // Fetch both sessions and messages when selecting a conversation
    await Promise.all([
      fetchSessionsWithConversation(id),
      fetchMessages(id)
    ]);
  }, []);

  const getConversations = useRecoilCallback(({ snapshot }) => () => {
    const conversations = snapshot.getLoadable(allConversationsState).getValue();
    return conversations;
  }, []);

  return {
    getConversationIds,
    getCurrentConversation,
    createNewConversation,
    updateConversation,
    deleteConversation,
    setCurrentConversationId,
    fetchConversations,
    getConversations
  };
}