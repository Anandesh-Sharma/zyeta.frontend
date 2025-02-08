import { atom, atomFamily } from 'recoil';
import { ConversationState, ConversationIdsState, CurrentConversationIdState } from './types';

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
export const conversationIdsState = atom<ConversationIdsState>({
  key: 'conversations/conversationIdsState',
  default: [],
});

// Current conversation ID
export const currentConversationIdState = atom<CurrentConversationIdState>({
  key: 'conversations/currentConversationIdState',
  default: null,
});