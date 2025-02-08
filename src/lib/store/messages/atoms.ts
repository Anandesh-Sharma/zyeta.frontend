import { atomFamily } from 'recoil';
import { Message } from '@/lib/types/message';

export const messagesByConversationFamily = atomFamily<Message[] | undefined, string>({
  key: 'messages/messagesByConversationFamily',
  default: undefined,
});

export const isRespondingConversationFamily = atomFamily<boolean, string>({
  key: 'messages/isRespondingConversationFamily',
  default: false,
});

export const isLoadingMessagesConversationFamily = atomFamily<boolean, string>({
  key: 'messages/isLoadingMessagesConversationFamily',
  default: false,
});