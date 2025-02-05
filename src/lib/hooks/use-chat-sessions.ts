import { useRecoilCallback } from 'recoil';
import { chatSessionsByConversationFamily, activeSessionIdByConversationFamily } from '../store/chat-sessions/atoms';
import { ChatSession, CreateChatSessionRequest, ConversationWithSessions } from '../types/chat-session';
import { useNetwork } from './use-network';
import OrgState from '../store/organization/org-state';
import { useRecoilValue } from 'recoil';
import { llmModelsState } from '../store/assistants/atoms';

export function useChatSessions() {
  const { makeRequest } = useNetwork();
  const models = useRecoilValue(llmModelsState);

  const fetchSessionsWithConversation = useRecoilCallback(({ set }) => async (conversationId: string) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    try {
      const response = await makeRequest<ConversationWithSessions>(
        `/api/conversation/get_with_sessions?org_id=${orgId}&conversation_id=${conversationId}`
      );
      
      // Update sessions
      set(chatSessionsByConversationFamily(conversationId), response.chat_sessions);
      
      // Set active session if there is one
      const activeSession = response.chat_sessions.find(session => session.status === 'active');
      if (activeSession) {
        set(activeSessionIdByConversationFamily(conversationId), activeSession.id);
      }

      return response;
    } catch (err) {
      console.error('Failed to fetch conversation sessions:', err);
      throw err;
    }
  });

  const createChatSession = useRecoilCallback(({ set, snapshot }) => async (request: CreateChatSessionRequest) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    try {
      // Get model name from models list
      const model = models.find(m => m.id === request.model_id);
      const modelName = model?.name || request.model_id;

      const response = await makeRequest<ChatSession>(
        `/api/conversation/create_session?org_id=${orgId}`,
        {
          method: 'POST',
          body: {
            ...request,
            model_name: modelName // Include model name in request
          }
        }
      );

      // Get current sessions and append new one
      const currentSessions = await snapshot.getPromise(chatSessionsByConversationFamily(request.conversation_id));

      // End any other active sessions for this conversation
      const updatedSessions = currentSessions.map(session => 
        session.status === 'active' ? { ...session, status: 'ended' } : session
      );

      // Add new session with model name
      const sessionWithModelName = {
        ...response,
        model_name: modelName
      };

      set(chatSessionsByConversationFamily(request.conversation_id), [...updatedSessions, sessionWithModelName]);
      
      // Set as active session
      set(activeSessionIdByConversationFamily(request.conversation_id), sessionWithModelName.id);

      return sessionWithModelName;
    } catch (err) {
      console.error('Failed to create chat session:', err);
      throw err;
    }
  });

  const updateChatSession = useRecoilCallback(({ set }) => async (
    conversationId: string,
    sessionId: string,
    updates: Partial<ChatSession>
  ) => {
    set(chatSessionsByConversationFamily(conversationId), (prev) => 
      prev.map(session => 
        session.id === sessionId ? { ...session, ...updates } : session
      )
    );
  });

  const endChatSession = useRecoilCallback(({ set }) => async (conversationId: string, sessionId: string) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      throw new Error('No organization ID available');
    }

    try {
      await makeRequest(
        `/api/conversation/end_session/${sessionId}?org_id=${orgId}`,
        { method: 'POST' }
      );

      // Update session status
      set(chatSessionsByConversationFamily(conversationId), (prev) =>
        prev.map(session =>
          session.id === sessionId ? { ...session, status: 'ended' } : session
        )
      );

      // Clear active session if it was the active one
      set(activeSessionIdByConversationFamily(conversationId), (currentId) =>
        currentId === sessionId ? null : currentId
      );
    } catch (err) {
      console.error('Failed to end chat session:', err);
      throw err;
    }
  });

  const setActiveSession = useRecoilCallback(({ set }) => (conversationId: string, sessionId: string) => {
    set(activeSessionIdByConversationFamily(conversationId), sessionId);
  });

  const getActiveSessions = useRecoilCallback(({ snapshot }) => async (conversationId: string) => {
    const sessions = await snapshot.getPromise(chatSessionsByConversationFamily(conversationId));
    return sessions.filter(session => session.status === 'active');
  });

  const getAllSessions = useRecoilCallback(({ snapshot }) => async (conversationId: string) => {
    return snapshot.getPromise(chatSessionsByConversationFamily(conversationId));
  });

  return {
    createChatSession,
    updateChatSession,
    endChatSession,
    setActiveSession,
    getActiveSessions,
    getAllSessions,
    fetchSessionsWithConversation,
  };
}