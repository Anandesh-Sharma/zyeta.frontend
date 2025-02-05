import React, { useMemo } from 'react';
import { Search, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { getAssistant } from '@/lib/constants/chat';
import { Button } from '@/components/ui/button';
import { chatSessionsByConversationFamily, activeSessionIdByConversationFamily } from '@/lib/store/chat-sessions/atoms';
import { SessionFilter } from './session-filter';
import { useRecoilValue } from 'recoil';

interface ConversationHeaderProps {
  modelId: string;
  conversationId: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onToggleDetails: () => void;
  onSelectSession: (sessionId: string) => void;
}

export function ConversationHeader({
  modelId,
  conversationId,
  isSidebarOpen,
  onToggleSidebar,
  onOpenSearch,
  onToggleDetails,
  onSelectSession
}: ConversationHeaderProps) {
  const sessions = useRecoilValue(chatSessionsByConversationFamily(conversationId));
  const activeSessionId = useRecoilValue(activeSessionIdByConversationFamily(conversationId));
  const assistant = getAssistant(modelId);
  const Icon = assistant.icon;

  // Get active session's model name
  const activeSession = useMemo(() => 
    sessions.find(s => s.id === activeSessionId), 
    [sessions, activeSessionId]
  );

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
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium">
            {activeSession?.model_name || assistant.name}
          </span>
          {sessions.length > 0 && (
            <SessionFilter
              conversationId={conversationId}
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={onSelectSession}
            />
          )}
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