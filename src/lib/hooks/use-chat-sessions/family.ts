import type { IHookAction, HookStateReturnType } from '@/lib/types';
import type { ChatSession } from '@/lib/types';

import { RecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationSessionsByConversationFamily, selectedSessionIdByConversationFamily } from '@/lib/store/chat-sessions';

type IType = 
  "conversationSessionsByConversation" |
  "selectedSessionIdByConversation";

type ReturnType<T extends IType> = 
  T extends "conversationSessionsByConversation" 
    ? ChatSession[]
    : T extends "selectedSessionIdByConversation"
      ? string | null
      : null;

export function useChatSessionsAtomFamily<T extends IType, K extends IHookAction>(
  type: T,
  action: K,
  conversationId: string
): HookStateReturnType<ReturnType<T>, K> {
  let state: RecoilState<any>;
  switch (type) {
    case "conversationSessionsByConversation":
      state = conversationSessionsByConversationFamily(conversationId);
      break;
    case "selectedSessionIdByConversation":
      state = selectedSessionIdByConversationFamily(conversationId);
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") {
    return useRecoilValue(state) as HookStateReturnType<ReturnType<T>, K>;
  }
  return useSetRecoilState(state) as HookStateReturnType<ReturnType<T>, K>;
}