import { atomFamily } from 'recoil';
import { Message } from '@/lib/types/message';

export const messagesByChatAtom = atomFamily<Message[] | undefined, string>({
  key: 'messages/messagesByChatAtom',
  default: undefined,
});

export const isRespondingState = atomFamily<boolean, string>({
  key: 'messages/isRespondingState',
  default: false,
});

export const isLoadingMessagesState = atomFamily<boolean, string>({
  key: 'messages/isLoadingMessagesState',
  default: false,
});