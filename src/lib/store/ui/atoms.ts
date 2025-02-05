import { atom } from 'recoil';

export const uiState = atom({
  key: 'ui/state',
  default: {
    isSidebarOpen: true,
    isDetailsPanelOpen: true,
    isSearchOpen: false,
    isModelSelectOpen: false,
  },
});