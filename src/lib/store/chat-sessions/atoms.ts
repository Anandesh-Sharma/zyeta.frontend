import { atom, atomFamily } from 'recoil';
import { ChatSession } from '@/lib/types/chat-session';

// Store all sessions for each conversation
export const chatSessionsByConversationFamily = atomFamily<ChatSession[], string>({
  key: 'chatSessions/byConversationFamily',
  default: [],
});

// Store current active session ID for each conversation
export const activeSessionIdByConversationFamily = atomFamily<string | null, string>({
  key: 'chatSessions/activeSessionIdByConversation',
  default: null,
});

// Store the selected session ID in the dropdown (can be 'all')
export const selectedSessionIdByConversationFamily = atomFamily<string | 'all', string>({
  key: 'chatSessions/selectedSessionIdByConversation',
  default: 'all',
});