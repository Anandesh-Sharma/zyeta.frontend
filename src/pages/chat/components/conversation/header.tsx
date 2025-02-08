import { Search, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionFilter } from './session-filter';
import { useUI } from '@/lib/hooks/use-ui';
import { useSelectedAssistant } from '@/lib/hooks/use-chat-sessions';

export function ConversationHeader() {
  const toggleSidebar = useUI('isSidebarOpen', 'set');
  const toggleDetailsPanel = useUI('isDetailsPanelOpen', 'set');
  const toggleSearch = useUI('isSearchOpen', 'set');

  const isSidebarOpen = useUI('isSidebarOpen', 'get');
  
  const assistant = useSelectedAssistant();

  // const Icon = assistant?.icon;

  return (
    <div className="h-12 border-b border-border flex items-center px-3 justify-between flex-shrink-0 bg-background">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={isSidebarOpen ? Minimize2 : Maximize2}
          onClick={() => toggleSidebar(prev => !prev)}
        />
        <div className="flex items-center gap-2">
          {/* <Icon className="h-4 w-4" /> */}
          <span className="text-sm font-medium">
            {assistant?.name}
          </span>
          <SessionFilter />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          icon={Search}
          onClick={() => toggleSearch(prev => !prev)}
        />
        <Button
          variant="ghost"
          size="sm"
          icon={Settings}
          onClick={() => toggleDetailsPanel(prev => !prev)}
        />
      </div>
    </div>
  );
}