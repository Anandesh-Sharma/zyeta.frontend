import type { LLMModel } from "@/lib/types";
import type { IHookAction, HookStateReturnType } from "@/lib/types/hooks";

import { RecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { llmModelsState, llmModelsLoadingState } from "@/lib/store/assistants/atoms";

type IType = 
  "LLMModels" | 
  "LLMModelsLoading";

type ReturnType<T extends IType> = 
  T extends "LLMModels" 
    ? LLMModel[]
    : T extends "LLMModelsLoading" 
      ? boolean
      : null;

export const useLLMAtom = <T extends IType, K extends IHookAction>(
  stateName: T,
  action: K
): HookStateReturnType<ReturnType<T>, K> => {
  let state: RecoilState<any>;
  switch (stateName) {  
    case "LLMModels":
      state = llmModelsState;
      break;
    case "LLMModelsLoading":
      state = llmModelsLoadingState;
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") { 
    return useRecoilValue(state);
  }
  return useSetRecoilState(state) as HookStateReturnType<ReturnType<T>, K>;
};