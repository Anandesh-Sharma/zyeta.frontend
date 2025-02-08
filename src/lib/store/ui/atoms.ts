import { atomFamily } from 'recoil';

export type UIStateKey = 'isSidebarOpen' | 'isDetailsPanelOpen' | 'isSearchOpen' | 'isModelSelectOpen';

export const uiState = atomFamily<boolean, UIStateKey>({
  key: 'ui/state',
  default: (param) => {
    switch (param) {
      case 'isSidebarOpen':
      case 'isDetailsPanelOpen':
        return true;
      case 'isSearchOpen':
      case 'isModelSelectOpen':
        return false;
      default:
        return false;
    }
  },
});