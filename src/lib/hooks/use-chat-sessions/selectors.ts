import type { HookSelectorReturnType, IHookAction } from "@/lib/types/hooks";
import type { Assistant, ChatSession } from "@/lib/types";

import { RecoilValueReadOnly, useRecoilValue } from "recoil";
import { 
  allSessionsByConversationState, 
  selectedAssistanceBySessionState,
  selectedSessionByConversationState,
  sortedSessionsByConversationState
} from "@/lib/store/chat-sessions";
import { useConversationSelector } from "../use-conversations";

type IType = 
  "allSessionsByConversation" |
  "selectedSessionByConversation" |
  "selectedAssistanceBySession" |
  "sortedSessionsByConversation";

type ReturnType<T extends IType> = 
  T extends "allSessionsByConversation" 
    ? ChatSession[]
    : T extends "selectedSessionByConversation"
      ? ChatSession | null
      : T extends "selectedAssistanceBySession"
        ? Assistant | null
        : T extends "sortedSessionsByConversation"
          ? ChatSession[]
          : null;

export const useChatSessionsSelector = <T extends IType>(
  stateName: T,
  action: IHookAction,
  id: string,
): HookSelectorReturnType<ReturnType<T>, IHookAction> => {
  let state: RecoilValueReadOnly<any>;
  switch (stateName) {
    case "allSessionsByConversation":
      state = allSessionsByConversationState(id);
      break;
    case "selectedSessionByConversation":
      state = selectedSessionByConversationState(id);
      break;
    case "sortedSessionsByConversation":
      state = sortedSessionsByConversationState(id);
      break;
    case "selectedAssistanceBySession":
      state = selectedAssistanceBySessionState(id);
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") {
    return useRecoilValue(state);
  }
  throw new Error("Invalid type");
};

export const useSelectedAssistant = () => {
  const currentConversation = useConversationSelector('currentConversation', 'get');
  return useChatSessionsSelector('selectedAssistanceBySession', 'get', currentConversation?.id ?? '');
};

export const useSelectedSession = () => {
  const currentConversation = useConversationSelector('currentConversation', 'get');
  const selectedSession = useChatSessionsSelector('selectedSessionByConversation', 'get', currentConversation?.id ?? '');
  return selectedSession;
};