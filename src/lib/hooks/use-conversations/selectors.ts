import type { ConversationState } from "@/lib/store/conversations/types";
import type { IHookAction, HookSelectorReturnType } from "@/lib/types/hooks";

import { RecoilValue, useRecoilValue } from "recoil";
import { currentConversationState, sortedConversationsState, allConversationsState } from "@/lib/store/conversations/selectors";

type IType = 
  "allConversations" | 
  "currentConversation" | 
  "sortedConversations";

type ReturnType<T extends IType> = 
  T extends "currentConversation" 
    ? ConversationState | null
    : T extends "sortedConversations" 
      ? ConversationState[]
      : T extends "allConversations" 
        ? ConversationState[]
        : null;

export const useConversationSelector = <T extends IType>(
  type: T,
  action: IHookAction
): HookSelectorReturnType<ReturnType<T>, IHookAction> => {
  let state: RecoilValue<any>;
  switch (type) {
    case "currentConversation":
      state = currentConversationState;
      break;
    case "sortedConversations":
      state = sortedConversationsState;
      break;
    case "allConversations":
      state = allConversationsState;
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") { 
    return useRecoilValue(state);
  }
  throw new Error("Invalid type");
};
