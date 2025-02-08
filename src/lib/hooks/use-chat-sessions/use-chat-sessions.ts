import type { ChatSession, CreateChatSessionRequest, ConversationWithSessions } from '@/lib/types';

import { useRecoilCallback } from 'recoil';
import { useNetwork } from '../use-network';
import OrgState from '@/lib/store/organization/org-state';
import { currentConversationState } from '@/lib/store/conversations';
import { 
  selectedAssistanceBySessionState,
  conversationSessionsByConversationFamily,
  selectedSessionIdByConversationFamily
} from '@/lib/store/chat-sessions';
import { assistantsState } from '@/lib/store/assistants';

export function useChatSessions() {
  const { makeRequest } = useNetwork();

  const fetchSessionsWithConversation = useRecoilCallback(({ set }) => async (conversationId: string) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    try {
      const response = await makeRequest<ConversationWithSessions>(
        `/conversation/get_with_sessions?org_id=${orgId}&conversation_id=${conversationId}`
      );
      
      // Update sessions
      set(conversationSessionsByConversationFamily(conversationId), response.chat_sessions);
      
      // Set active session if there is one
      const activeSession = response.chat_sessions.find(session => session.status === 'active');
      if (activeSession) {
        set(selectedSessionIdByConversationFamily(conversationId), activeSession.id);
      }

      return response;
    } catch (err) {
      console.error('Failed to fetch conversation sessions:', err);
      throw err;
    }
  }, []);

  const getSelectedAssistant = useRecoilCallback(({ snapshot }) => () => {
    const currentConversation = snapshot.getLoadable(currentConversationState).getValue();
    if (!currentConversation?.id) {
      return null;
    }
    const found = snapshot.getLoadable(selectedAssistanceBySessionState(currentConversation.id)).getValue();
    if (!found) {
      return null;
    }
    return found;
  }, []);

  const createChatSession = useRecoilCallback(({ set, snapshot }) => async (request: CreateChatSessionRequest) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    const assistants = snapshot.getLoadable(assistantsState).getValue();
    const selectedAssistant = assistants.find(assistant => assistant.id === request.model_id);  

    request.model_id = selectedAssistant?.id;
    try {
      // Get model name from models list
      const response = await makeRequest<ChatSession>(
        `/conversation/create_session?org_id=${orgId}`,
        {
          method: 'POST',
          body: {
            ...request,
          }
        }
      );

      // Get current sessions and append new one
      const currentSessions = await snapshot.getPromise(conversationSessionsByConversationFamily(request.conversation_id));

      // End any other active sessions for this conversation
      const updatedSessions = currentSessions.map(session => ({
        ...session,
        status: session.status === 'active' ? 'ended' : session.status
      }));

      // Add new session with model name
      const sessionWithModelName = {
        ...response,
        model_name: selectedAssistant?.name ?? 'Assistant'
      };

      set(conversationSessionsByConversationFamily(request.conversation_id), [...updatedSessions, sessionWithModelName]);
      
      // Set as active session
      set(selectedSessionIdByConversationFamily(request.conversation_id), sessionWithModelName.id);

      return sessionWithModelName;
    } catch (err) {
      console.error('Failed to create chat session:', err);
      throw err;
    }
  }, []);

  const setSelectedSession = useRecoilCallback(({ set }) => (conversationId: string, sessionId: string) => {
    set(selectedSessionIdByConversationFamily(conversationId), sessionId);
  }, []);

  const getSelectedSession = useRecoilCallback(({ snapshot }) => () => {
    const currentConversation = snapshot.getLoadable(currentConversationState).getValue();
    if(!currentConversation?.id) {
      return null;
    }
    return snapshot.getLoadable(selectedSessionIdByConversationFamily(currentConversation.id)).getValue();
  }, []);

  const getAllActiveSessions = useRecoilCallback(({ snapshot }) => async (conversationId: string) => {
    const sessions = await snapshot.getPromise(conversationSessionsByConversationFamily(conversationId));
    return sessions.filter(session => session.status === 'active');
  }, []);

  const getAllSessions = useRecoilCallback(({ snapshot }) => (conversationId: string) => {
    return snapshot.getLoadable(conversationSessionsByConversationFamily(conversationId)).getValue();
  }, []);

  return {
    createChatSession,
    setSelectedSession,
    getAllActiveSessions,
    getSelectedSession,
    getAllSessions,
    getSelectedAssistant,
    fetchSessionsWithConversation,
  };
}