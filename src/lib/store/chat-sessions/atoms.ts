import { atomFamily } from 'recoil';
import { ChatSession } from '@/lib/types/chat-session';

// Store all sessions for each conversation
export const conversationSessionsByConversationFamily = atomFamily<ChatSession[], string>({
  key: 'chatSessions/byConversationFamily',
  default: [],
});

// Store current active session ID for each conversation
export const selectedSessionIdByConversationFamily = atomFamily<string | null, string>({
  key: 'chatSessions/selectedSessionIdByConversation',
  default: null,
});
