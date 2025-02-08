import type { Knowledge } from "@/lib/types";
import type { IHookAction, HookSelectorReturnType } from "@/lib/types";

import { RecoilValue, useRecoilValue } from "recoil";
import { currentKnowledgeState, sortedKnowledgeState, allKnowledgeState } from "@/lib/store/knowledge";

type IType = 
  "allKnowledge" | 
  "currentKnowledge" | 
  "sortedKnowledge";

type ReturnType<T extends IType> = 
  T extends "currentKnowledge" 
    ? Knowledge | null
    : T extends "sortedKnowledge" 
      ? Knowledge[]
      : T extends "allKnowledge" 
        ? Knowledge[]
        : null;

export const useKnowledgeSelector = <T extends IType>(
  type: T,
  action: IHookAction
): HookSelectorReturnType<ReturnType<T>, IHookAction> => {
  let state: RecoilValue<any>;
  switch (type) {
    case "currentKnowledge":
      state = currentKnowledgeState;
      break;
    case "sortedKnowledge":
      state = sortedKnowledgeState;
      break;
    case "allKnowledge":
      state = allKnowledgeState;
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") { 
    return useRecoilValue(state);
  }
  throw new Error("Invalid action");
}; 