import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { selectedSessionIdByConversationFamily } from '@/lib/store/chat-sessions/atoms';
import { useConversations } from '@/lib/hooks/use-conversations';
import { useChatSessions } from '@/lib/hooks/use-chat-sessions';

export function SessionFilter() {
  const {currentConversation} = useConversations();
  const {setSelectedSession, getAllSessions} = useChatSessions();

  const onSelectSession = useCallback((sessionId: string) => {
    if (currentConversation?.id) {
      // setActiveSession(currentConversation.id, sessionId);
    }
  }, [currentConversation]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedSessionId, setSelectedSessionId] = useRecoilState(
    selectedSessionIdByConversationFamily(currentConversation?.id ?? '')
  );

  const sessions = useMemo(() => getAllSessions(currentConversation?.id ?? ''), [currentConversation]);

  // Sort sessions by creation date, newest first
  const sortedSessions = useMemo(() => 
    [...sessions].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ), 
    [sessions]
  );

  // Get the latest active session
  const latestActiveSession = useMemo(() => 
    sortedSessions.find(s => s.status === 'active') || sortedSessions[0],
    [sortedSessions]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSession = (sessionId: string | 'all') => {
    setSelectedSessionId(sessionId);
    
    // When selecting "All", use the latest session's ID for model info
    if (sessionId === 'all' && latestActiveSession) {
      onSelectSession(latestActiveSession.id);
    } else if (sessionId !== 'all') {
      onSelectSession(sessionId);
    }
    
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-muted-foreground hover:text-foreground h-6 px-2 gap-1"
      >
        <span>
          {selectedSessionId === 'all' ? 'All Sessions' : (
            sessions.find(s => s.id === selectedSessionId)?.model_name || 'Select Session'
          )}
        </span>
        <ChevronDown className={cn(
          "h-3 w-3 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 w-48 z-50 bg-popover border border-border rounded-md shadow-md overflow-hidden"
          >
            <div className="p-1 space-y-0.5">
              {/* All Sessions Option */}
              <button
                onClick={() => handleSelectSession('all')}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors',
                  selectedSessionId === 'all'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                <div className="flex-1 text-left">
                  <div className="font-medium">All Sessions</div>
                  <div className="text-xs opacity-70">
                    View all messages
                  </div>
                </div>
              </button>

              <div className="h-px bg-border mx-1" />

              {/* Individual Sessions */}
              {sortedSessions.map((session, index) => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors',
                    session.id === selectedSessionId
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="flex-1 text-left">
                    <div className="font-medium">
                      {session.model_name}
                      {session.agent_name && ` • ${session.agent_name}`}
                    </div>
                    <div className="text-xs opacity-70">
                      Session {sortedSessions.length - index}
                    </div>
                  </div>
                  {session.status === 'active' && (
                    <div className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded-sm">
                      Active
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}