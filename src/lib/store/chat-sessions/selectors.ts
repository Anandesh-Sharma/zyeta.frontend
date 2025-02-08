import { selectorFamily } from 'recoil';
import {  conversationSessionsByConversationFamily, selectedSessionIdByConversationFamily } from './atoms';
import { ChatSession } from '@/lib/types/chat-session';
import { Assistant } from '@/lib/types';
import { assistantsState } from '../assistants/selectors';

// Get all sessions for a conversation
export const allSessionsByConversationState = selectorFamily<ChatSession[], string>({
  key: 'chatSessions/allSessionsByConversation',
  get: (conversationId: string) => ({ get }) => {
    return get(conversationSessionsByConversationFamily(conversationId));
  },
});

// // Get active session for a conversation
export const selectedSessionByConversationState = selectorFamily<ChatSession | null, string>({
  key: 'chatSessions/selectedSessionByConversation',
  get: (conversationId: string) => ({ get }) => {
    const sessions = get(conversationSessionsByConversationFamily(conversationId));
    const selectedSessionId = get(selectedSessionIdByConversationFamily(conversationId));
    return sessions.find(session => session.id === selectedSessionId) || null;
  },
});

export const selectedAssistanceBySessionState = selectorFamily<Assistant | null, string>({
  key: 'chatSessions/selectedAssistanceBySession',
  get: (conversationId: string) => ({ get }) => {
    const selectedSession = get(selectedSessionByConversationState(conversationId));

    console.log('selectedSessionId', selectedSession)
    const assistants = get(assistantsState);
    const selectedAssistant = assistants.find(assistant => assistant.id === selectedSession?.model_id);
    return selectedAssistant || null;
  },
});

// Get active sessions sorted by creation date
export const sortedSessionsByConversationState = selectorFamily<ChatSession[], string>({
  key: 'chatSessions/sortedSessionsByConversation',
  get: (conversationId: string) => ({ get }) => {
    const sessions = get(conversationSessionsByConversationFamily(conversationId));
    return [...sessions].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
});