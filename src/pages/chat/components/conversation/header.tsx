import { useMemo } from 'react';
import { Search, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SessionFilter } from './session-filter';
import { useUI } from '@/lib/hooks/use-ui';
import { useChatSessions } from '@/lib/hooks/use-chat-sessions';

export function ConversationHeader() {
  const { ui, toggleSidebar: onToggleSidebar, toggleDetailsPanel: onToggleDetails, toggleSearch: onOpenSearch } = useUI();
  const isSidebarOpen = ui.isSidebarOpen;
  
  const {getSelectedAssistant} = useChatSessions();
  const assistant = useMemo(() => getSelectedAssistant(), [getSelectedAssistant]);  

  // const Icon = assistant?.icon;

  return (
    <div className="h-12 border-b border-border flex items-center px-3 justify-between flex-shrink-0 bg-background">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={isSidebarOpen ? Minimize2 : Maximize2}
          onClick={onToggleSidebar}
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
          onClick={onOpenSearch}
        />
        <Button
          variant="ghost"
          size="sm"
          icon={Settings}
          onClick={onToggleDetails}
        />
      </div>
    </div>
  );
}