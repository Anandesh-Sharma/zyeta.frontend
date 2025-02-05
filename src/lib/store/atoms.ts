import { atom } from 'recoil';
import { ALL_ASSISTANTS } from '@/lib/constants/chat';
import { v4 as uuidv4 } from 'uuid';

const createNewChat = (assistantId = ALL_ASSISTANTS[0].id): Chat => ({
  id: uuidv4(),
  title: 'New Chat',
  messages: [],
  model: assistantId,
  timestamp: Date.now(),
});

export const chatsState = atom<Chat[]>({
  key: 'chatsState',
  default: [createNewChat()],
});

export const currentChatIdState = atom<string>({
  key: 'currentChatIdState',
  default: '',
});

export const messageInputState = atom<string>({
  key: 'messageInputState',
  default: '',
});

export const uiState = atom({
  key: 'uiState',
  default: {
    isSidebarOpen: true,
    isDetailsPanelOpen: true,
    isSearchOpen: false,
    isModelSelectOpen: false,
  },
});