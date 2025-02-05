import { selector, selectorFamily } from 'recoil';
import { conversationAtomFamily, conversationIdsState, currentConversationIdState } from './atoms';
import { ConversationState } from './types';

// Get all conversations
export const allConversationsState = selector<ConversationState[]>({
  key: 'conversations/allConversationsState',
  get: ({ get }) => {
    const conversationIds = get(conversationIdsState);
    return conversationIds.map(id => get(conversationAtomFamily(id)));
  },
});

// Get current conversation
export const currentConversationState = selector<ConversationState | null>({
  key: 'conversations/currentConversationState',
  get: ({ get }) => {
    const currentId = get(currentConversationIdState);
    const conversationIds = get(conversationIdsState);
    
    // If no current ID, use first conversation
    const id = currentId || conversationIds[0];
    return id ? get(conversationAtomFamily(id)) : null;
  },
});

// Get sorted conversations
export const sortedConversationsState = selector<ConversationState[]>({
  key: 'conversations/sortedConversationsState',
  get: ({ get }) => {
    const conversations = get(allConversationsState);
    return [...conversations].sort((a, b) => b.timestamp - a.timestamp);
  },
});

// Get conversation by ID
export const conversationByIdState = selectorFamily<ConversationState | null, string>({
  key: 'conversations/conversationByIdState',
  get: (id) => ({ get }) => {
    const conversationIds = get(conversationIdsState);
    return conversationIds.includes(id) ? get(conversationAtomFamily(id)) : null;
  },
});