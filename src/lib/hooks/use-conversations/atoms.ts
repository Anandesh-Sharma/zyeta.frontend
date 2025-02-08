import type {ConversationIdsState, CurrentConversationIdState } from "@/lib/store/conversations/types";

import { RecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationIdsState, currentConversationIdState } from "@/lib/store/conversations/atoms";
import { HookStateReturnType, type IHookAction } from "@/lib/types/hooks";

type IType = 
  "conversationIds" | 
  "currentConversationId";

type ReturnType<T extends IType> = 
  T extends "conversationIds" 
    ? ConversationIdsState  
    : T extends "currentConversationId" 
      ? CurrentConversationIdState
      : null;

export const useConversationAtom = <T extends IType, K extends IHookAction>(
  stateName: T,
  action: K
): HookStateReturnType<ReturnType<T>, K> => {
  let state: RecoilState<any>;
  switch (stateName) {
    case "conversationIds":
      state = conversationIdsState;
      break;
    case "currentConversationId":
      state = currentConversationIdState;
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") { 
    return useRecoilValue(state);
  }
  return useSetRecoilState(state) as HookStateReturnType<ReturnType<T>, K>;
};