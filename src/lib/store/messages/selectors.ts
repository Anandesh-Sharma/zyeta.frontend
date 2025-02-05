import { selectorFamily, selector } from 'recoil';
import { messagesByChatAtom } from './atoms';
import { currentChatIdState } from '../chat/atoms';
import { Message } from '@/lib/types';

// Get messages for a specific chat
export const chatMessagesSelector = selectorFamily<MessageState[], string>({
  key: 'messages/chatMessagesSelector',
  get: (chatId: string) => ({ get }) => {
    return get(messagesByChatAtom(chatId));
  },
});

// Get current chat messages
export const currentChatMessagesSelector = selector<MessageState[]>({
  key: 'messages/currentChatMessagesSelector',
  get: ({ get }) => {
    const currentChatId = get(currentChatIdState);
    if (!currentChatId) return [];
    return get(messagesByChatAtom(currentChatId));
  },
});

// Get last message for a chat
export const lastMessageSelector = selectorFamily<MessageState | null, string>({
  key: 'messages/lastMessageSelector',
  get: (chatId: string) => ({ get }) => {
    const messages = get(messagesByChatAtom(chatId));
    return messages.length > 0 ? messages[messages.length - 1] : null;
  },
});