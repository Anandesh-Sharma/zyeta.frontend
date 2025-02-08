import type { Organization } from "@/lib/types";
import type { HookSelectorReturnType, IHookAction } from "@/lib/types/hooks";

import { RecoilValueReadOnly, useRecoilValue } from "recoil";
import { currentOrganizationState } from "@/lib/store/organization/selectors";

type IType = 
  "currentOrganization";

type ReturnType<T extends IType> = 
  T extends "currentOrganization" 
    ? Organization | null 
    : null;

export const useGetOrganizationSelector = <T extends IType>(
  stateName: T,
  action: IHookAction
): HookSelectorReturnType<ReturnType<T>, IHookAction> => {
  let state: RecoilValueReadOnly<any>;
  switch (stateName) {
    case "currentOrganization":
      state = currentOrganizationState;
      break;
    default:
      throw new Error("Invalid type");
  }
  if (action === "get") {
    return useRecoilValue(state);
  }
  throw new Error("Invalid type");
};
