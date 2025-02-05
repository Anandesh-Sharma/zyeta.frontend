import { selector } from 'recoil';
import { chatsState, currentChatIdState } from './atoms';
import { Chat } from '@/lib/types';

export const currentChatState = selector<Chat | null>({
  key: 'currentChatState',
  get: ({ get }) => {
    const chats = get(chatsState);
    const currentChatId = get(currentChatIdState);
    return chats.find(chat => chat.id === currentChatId) || chats[0];
  },
});

export const sortedChatsState = selector<Chat[]>({
  key: 'sortedChatsState',
  get: ({ get }) => {
    const chats = get(chatsState);
    return [...chats].sort((a, b) => b.timestamp - a.timestamp);
  },
});