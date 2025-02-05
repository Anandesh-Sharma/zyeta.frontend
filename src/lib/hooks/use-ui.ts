import { useRecoilState } from 'recoil';
import { uiState } from '../store/ui/atoms';

export function useUI() {
  const [ui, setUI] = useRecoilState(uiState);

  const toggleSidebar = () => {
    setUI(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
  };

  const toggleDetailsPanel = () => {
    setUI(prev => ({ ...prev, isDetailsPanelOpen: !prev.isDetailsPanelOpen }));
  };

  const toggleSearch = () => {
    setUI(prev => ({ ...prev, isSearchOpen: !prev.isSearchOpen }));
  };

  const toggleModelSelect = () => {
    setUI(prev => ({ ...prev, isModelSelectOpen: !prev.isModelSelectOpen }));
  };

  return {
    ui,
    toggleSidebar,
    toggleDetailsPanel,
    toggleSearch,
    toggleModelSelect,
  };
}