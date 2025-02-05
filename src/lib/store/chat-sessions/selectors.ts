import { selectorFamily } from 'recoil';
import { chatSessionsByConversationFamily, activeSessionIdByConversationFamily } from './atoms';
import { ChatSession } from '@/lib/types/chat-session';

// Get all sessions for a conversation
export const allSessionsByConversationState = selectorFamily<ChatSession[], string>({
  key: 'chatSessions/allSessionsByConversation',
  get: (conversationId: string) => ({ get }) => {
    return get(chatSessionsByConversationFamily(conversationId));
  },
});

// Get active session for a conversation
export const activeSessionByConversationState = selectorFamily<ChatSession | null, string>({
  key: 'chatSessions/activeSessionByConversation',
  get: (conversationId: string) => ({ get }) => {
    const sessions = get(chatSessionsByConversationFamily(conversationId));
    const activeId = get(activeSessionIdByConversationFamily(conversationId));
    return sessions.find(session => session.id === activeId) || null;
  },
});

// Get active sessions sorted by creation date
export const sortedSessionsByConversationState = selectorFamily<ChatSession[], string>({
  key: 'chatSessions/sortedSessionsByConversation',
  get: (conversationId: string) => ({ get }) => {
    const sessions = get(chatSessionsByConversationFamily(conversationId));
    return [...sessions].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
});