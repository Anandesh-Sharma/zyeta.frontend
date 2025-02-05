import { atom, atomFamily } from 'recoil';
import { ConversationState } from './types';
import { ALL_ASSISTANTS } from '@/lib/constants/chat';
import { v4 as uuidv4 } from 'uuid';

const initialConversationId = uuidv4();

// Individual conversation atom family
export const conversationAtomFamily = atomFamily<ConversationState, string>({
  key: 'conversations/conversationAtomFamily',
  default: (id) => ({
    id,
    title: 'New Chat',
    model: ALL_ASSISTANTS[0].id,
    timestamp: Date.now(),
  }),
});

// Store conversation IDs in order
export const conversationIdsState = atom<string[]>({
  key: 'conversations/conversationIdsState',
  default: [initialConversationId],
});

// Current conversation ID
export const currentConversationIdState = atom<string>({
  key: 'conversations/currentConversationIdState',
  default: initialConversationId,
});