import { Plus, Store } from 'lucide-react';
import { useState } from 'react';
import { PublishAgentModal } from './publish-agent-modal';
import { Button } from '@/components/ui/button';

export function PublishedAgentsPage() {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="border-b border-border">
        <div className="px-4 py-4">
          <h1 className="text-lg font-medium">Published Agents</h1>
          <p className="text-sm text-muted-foreground">View and manage your published agents</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Store className="h-10 w-10 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-foreground mb-1">No Published Agents</h3>
          <p className="text-sm mb-3">Your published agents will appear here</p>
          <Button
            onClick={() => setIsPublishModalOpen(true)}
            icon={Plus}
          >
            Publish Agent
          </Button>
        </div>
      </div>

      <PublishAgentModal 
        isOpen={isPublishModalOpen} 
        onClose={() => setIsPublishModalOpen(false)} 
      />
    </div>
  );
}