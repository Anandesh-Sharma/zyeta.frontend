import React from 'react';
import { X, ChevronDown, Zap, Sparkles, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Conversation } from '@/lib/types';
import { getAssistant } from '@/lib/constants/chat';
import { AssistantSelector } from '@/components/assistant-selector/assistant-selector';
import { Button } from '@/components/ui/button';
import { useRecoilValue } from 'recoil';
import { chatSessionsByConversationFamily, activeSessionIdByConversationFamily } from '@/lib/store/chat-sessions/atoms';

interface ConversationDetailsProps {
  conversation: Conversation;
  isOpen: boolean;
  onClose: () => void;
  onUpdateConversation: (updates: Partial<Conversation>) => void;
}

export function ConversationDetails({
  conversation,
  isOpen,
  onClose,
  onUpdateConversation
}: ConversationDetailsProps) {
  const [isAssistantSelectOpen, setIsAssistantSelectOpen] = React.useState(false);
  const sessions = useRecoilValue(chatSessionsByConversationFamily(conversation.id));
  const activeSessionId = useRecoilValue(activeSessionIdByConversationFamily(conversation.id));
  const assistant = getAssistant(conversation.model);
  const Icon = assistant.icon || Bot;

  // Get active session's model name or fallback to assistant name
  const activeSession = React.useMemo(() => 
    sessions.find(s => s.id === activeSessionId),
    [sessions, activeSessionId]
  );

  const modelName = React.useMemo(() => 
    activeSession?.model_name || assistant?.name || 'Assistant',
    [activeSession, assistant]
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === ']' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsAssistantSelectOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <div className={cn(
        "w-[300px] border-l border-border bg-background flex flex-col transition-all duration-200 ease-in-out",
        !isOpen && "w-0 opacity-0"
      )}>
        <div className="h-12 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
          <h2 className="text-sm font-medium">Details</h2>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Assistant Selection */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Assistant</h3>
              <Button
                variant="ghost"
                onClick={() => setIsAssistantSelectOpen(true)}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{modelName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground group-hover:text-foreground">⌘]</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </div>

            {/* Model Settings */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Model Settings</h3>
              <div className="space-y-4">
                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <span className="text-sm text-muted-foreground">0.7</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-full accent-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls randomness: Lower values make the output more focused and deterministic.
                  </p>
                </div>

                {/* Max Length */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Maximum Length</span>
                    </div>
                    <span className="text-sm text-muted-foreground">1000</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    defaultValue="1000"
                    className="w-full accent-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    The maximum number of tokens to generate in the response.
                  </p>
                </div>
              </div>
            </div>

            {/* Model Information */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Model Information</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Model</div>
                  <div className="text-sm">{modelName}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Description</div>
                  <div className="text-sm">{assistant.description}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Context Length</div>
                  <div className="text-sm">4,096 tokens</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssistantSelector
        isOpen={isAssistantSelectOpen}
        onClose={() => setIsAssistantSelectOpen(false)}
        currentAssistantId={conversation.model}
      />
    </>
  );
}