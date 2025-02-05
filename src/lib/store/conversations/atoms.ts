import { atom, atomFamily } from 'recoil';
import { ConversationState } from './types';

// Individual conversation atom family
export const conversationAtomFamily = atomFamily<ConversationState, string>({
  key: 'conversations/conversationAtomFamily',
  default: (id) => ({
    id,
    title: 'New Chat',
    timestamp: Date.now(),
  }),
});

// Store conversation IDs in order
export const conversationIdsState = atom<string[]>({
  key: 'conversations/conversationIdsState',
  default: [],
});

// Current conversation ID
export const currentConversationIdState = atom<string | null>({
  key: 'conversations/currentConversationIdState',
  default: null,
});