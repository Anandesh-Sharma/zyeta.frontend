import type { IHookAction, HookStateReturnType } from '@/lib/types';

import { useRecoilValue, useSetRecoilState } from 'recoil';
import { uiState, type UIStateKey } from '@/lib/store/ui';

export function useUI<T extends UIStateKey, K extends IHookAction>(
  type: T,
  action: K
): HookStateReturnType<boolean, K> {
  if (action === "get") {
    return useRecoilValue(uiState(type)) as HookStateReturnType<boolean, K>;
  }
  
  return useSetRecoilState(uiState(type)) as HookStateReturnType<boolean, K>;
}
