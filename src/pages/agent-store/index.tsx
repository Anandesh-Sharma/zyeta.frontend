import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { filteredAssistantsState } from '@/lib/store/assistants/selectors';
import { AssistantFilter } from '@/components/assistant-selector/assistant-filter';
import { AssistantCard } from '@/components/assistant-selector/assistant-card';
import { PublishAgentModal } from './publish-agent-modal';
import { Button } from '@/components/ui/button';

export function AgentStorePage() {
  const filteredAssistants = useRecoilValue(filteredAssistantsState);
  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-56px-16px)] flex flex-col bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="px-4 py-1 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">Agent Store</h1>
            <p className="text-sm text-muted-foreground">Discover and publish powerful AI agents</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search agents..."
                className="w-64 h-9 pl-9 pr-3 rounded-md bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <Button
              onClick={() => setIsPublishModalOpen(true)}
              icon={Plus}
            >
              Publish Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Sidebar with Filters */}
        <div className="w-56 flex-shrink-0 border-r border-border">
          <div className="sticky top-0 h-full p-4 overflow-y-auto">
            <AssistantFilter />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Featured Section */}
            <div className="mb-6">
              <h2 className="text-sm font-medium mb-3">Featured Agents</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {filteredAssistants.slice(0, 4).map(assistant => (
                  <AssistantCard
                    key={assistant.id}
                    assistant={{
                      ...assistant,
                      rating: 4.5 + Math.random() * 0.5,
                      usageCount: `${Math.floor(Math.random() * 900 + 100)}K+`,
                      tags: assistant.type === 'core' ? ['Core'] : ['Agent'],
                      credits: assistant.id === 'gpt-4' ? 8 : Math.floor(Math.random() * 3) + 1,
                    }}
                    isSelected={selectedAssistantId === assistant.id}
                    onSelect={() => setSelectedAssistantId(assistant.id)}
                  />
                ))}
              </div>
            </div>

            {/* All Agents */}
            <div>
              <h2 className="text-sm font-medium mb-3">All Agents</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {filteredAssistants.map(assistant => (
                  <AssistantCard
                    key={assistant.id}
                    assistant={{
                      ...assistant,
                      rating: 4.5 + Math.random() * 0.5,
                      usageCount: `${Math.floor(Math.random() * 900 + 100)}K+`,
                      tags: assistant.type === 'core' ? ['Core'] : ['Agent'],
                      credits: assistant.id === 'gpt-4' ? 8 : Math.floor(Math.random() * 3) + 1,
                    }}
                    isSelected={selectedAssistantId === assistant.id}
                    onSelect={() => setSelectedAssistantId(assistant.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PublishAgentModal 
        isOpen={isPublishModalOpen} 
        onClose={() => setIsPublishModalOpen(false)} 
      />
    </div>
  );
}