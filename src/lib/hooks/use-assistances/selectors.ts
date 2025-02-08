import type { IHookAction, HookSelectorReturnType } from "@/lib/types";
import type { Assistant } from "@/lib/types";

import { RecoilValue, useRecoilValue } from "recoil";
import { assistantsState } from "@/lib/store/assistants";

type IType = 
  "assistants";

type ReturnType<T extends IType> = 
  T extends "assistants" 
    ? Assistant[]
    : null;

export const useAssistantsSelector = <T extends IType>(
  type: T,
  action: IHookAction
): HookSelectorReturnType<ReturnType<T>, IHookAction> => {
  let state: RecoilValue<any>;
  switch (type) {
    case "assistants":
      state = assistantsState;
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") { 
    return useRecoilValue(state);
  }
  throw new Error("Invalid type");
};
