import type { Document } from "@/lib/types";
import type { IHookAction, HookSelectorReturnType } from "@/lib/types";

import { RecoilValue, useRecoilValue } from "recoil";
import { allDocumentsState, sortedDocumentsState, documentByIdState } from "@/lib/store/documents";

type IType = 
  "allDocuments" | 
  "sortedDocuments" | 
  "documentById";

type ReturnType<T extends IType> = 
  T extends "documentById" 
    ? Document | null
    : T extends "sortedDocuments" 
      ? Document[]
      : T extends "allDocuments" 
        ? Document[]
        : null;

export const useDocumentSelector = <T extends IType>(
  type: T,
  documentId?: string
): HookSelectorReturnType<ReturnType<T>, IHookAction> => {
  let state: RecoilValue<any>;
  switch (type) {
    case "documentById":
      if (!documentId) throw new Error("Document ID required");
      state = documentByIdState(documentId);
      break;
    case "sortedDocuments":
      state = sortedDocumentsState;
      break;
    case "allDocuments":
      state = allDocumentsState;
      break;
    default:
      throw new Error("Invalid type");
  }
  return useRecoilValue(state);
}; 