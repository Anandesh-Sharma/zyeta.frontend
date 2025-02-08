import type { IHookAction, HookStateReturnType } from '@/lib/types/hooks';
import type { Message } from '@/lib/types/message';

import { RecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { messagesByConversationFamily, isLoadingMessagesConversationFamily, isRespondingConversationFamily } from '@/lib/store/messages/atoms';

type IType = 
  "messagesByConversation" |
  "isLoadingMessagesConversation" |
  "isRespondingConversation";

type ReturnType<T extends IType> = 
  T extends "messagesByConversation" 
    ? Message[]
    : T extends "isLoadingMessagesConversation"
      ? boolean
      : T extends "isRespondingConversation"
        ? boolean
        : null;

export function useMessagesAtomFamily<T extends IType, K extends IHookAction>(
  type: T,
  action: K,
  conversationId: string
): HookStateReturnType<ReturnType<T>, K> {
  let state: RecoilState<any>;
  switch (type) {
    case "messagesByConversation":
      state = messagesByConversationFamily(conversationId);
      break;
    case "isLoadingMessagesConversation":
      state = isLoadingMessagesConversationFamily(conversationId);
      break;
    case "isRespondingConversation":
      state = isRespondingConversationFamily(conversationId);
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") {
    return useRecoilValue(state);
  }
  return useSetRecoilState(state) as HookStateReturnType<ReturnType<T>, K>;
}