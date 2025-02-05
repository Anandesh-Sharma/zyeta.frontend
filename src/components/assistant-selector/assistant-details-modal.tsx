import { Bot, Star, Users, Zap, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Assistant } from '@/lib/types';
import { getAssistant } from '@/lib/constants/chat';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

interface AssistantDetailsModalProps {
  assistant: Assistant & {
    rating?: number;
    usageCount?: string;
    tags?: string[];
    credits?: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantDetailsModal({ assistant, isOpen, onClose }: AssistantDetailsModalProps) {
  const Icon = assistant.icon || Bot;

  const features = [
    { name: 'Code Generation', description: 'Write code in multiple languages' },
    { name: 'Code Review', description: 'Review and improve code quality' },
    { name: 'Documentation', description: 'Generate technical documentation' },
    { name: 'Testing', description: 'Create test cases and scenarios' },
  ];

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const footer = (
    <Button variant="ghost" onClick={handleClose}>
      Close
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      title={assistant.name}
      description={assistant.description}
      icon={<Icon className="h-5 w-5 text-primary-foreground" />}
      footer={footer}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Star className="h-4 w-4" />
              Rating
            </div>
            <div className="text-2xl font-semibold">{assistant.rating?.toFixed(1)}</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              Total Users
            </div>
            <div className="text-2xl font-semibold">{assistant.usageCount}</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              Credits
            </div>
            <div className="text-2xl font-semibold">{assistant.credits}</div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-sm font-medium mb-3">Features & Capabilities</h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map(feature => (
              <div
                key={feature.name}
                className="p-3 rounded-lg border border-border bg-muted/50"
              >
                <h4 className="font-medium mb-1">{feature.name}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example Use Cases */}
        <div>
          <h3 className="text-sm font-medium mb-3">Example Use Cases</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-lg border border-border bg-muted/50">
              <p className="text-sm">
                "Help me review this pull request and suggest improvements for code quality."
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-muted/50">
              <p className="text-sm">
                "Generate unit tests for this React component following best practices."
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-muted/50">
              <p className="text-sm">
                "Document this API endpoint following OpenAPI specification."
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}