import type { Organization } from "@/lib/types";
import type { IHookAction, HookStateReturnType } from "@/lib/types/hooks";

import { RecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentOrgIdState, organizationsState } from "@/lib/store/organization/atoms";

type IType = 
  "currentOrgId" | 
  "organizations";

type ReturnType<T extends IType> = 
  T extends "currentOrgId" 
    ? string | null
    : T extends "organizations" 
      ? Organization[]
      : null;

export const useOrganizationAtom = <T extends IType, K extends IHookAction>(
  stateName: T,
  action: K
): HookStateReturnType<ReturnType<T>, K> => {
  let state: RecoilState<any>;
  switch (stateName) {  
    case "currentOrgId":
      state = currentOrgIdState;
      break;
    case "organizations":
      state = organizationsState;
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") { 
    return useRecoilValue(state);
  }
  return useSetRecoilState(state) as HookStateReturnType<ReturnType<T>, K>;
};