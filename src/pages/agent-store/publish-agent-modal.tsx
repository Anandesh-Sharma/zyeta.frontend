import { Upload, Bot, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface PublishAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublishAgentModal({ isOpen, onClose }: PublishAgentModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    capabilities: [] as string[],
    icon: 'bot',
  });

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <div className="flex items-center gap-2">
        {step > 1 && (
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        )}
        <Button
          icon={step === 2 ? Upload : undefined}
          onClick={() => {
            if (step < 2) {
              setStep(step + 1);
            } else {
              // Handle publish
              console.log('Publishing agent:', formData);
              onClose();
            }
          }}
        >
          {step === 2 ? 'Publish Agent' : 'Continue'}
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Publish New Agent"
      description="Share your agent with the community"
      footer={footer}
    >
      <div className="p-4">
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Agent Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-md bg-muted border border-border focus:ring-1 focus:ring-ring text-sm"
                placeholder="e.g. Code Review Assistant"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-1.5 rounded-md bg-muted border border-border focus:ring-1 focus:ring-ring h-20 resize-none text-sm"
                placeholder="Describe what your agent does..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Icon</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bot', icon: Bot, label: 'Bot' },
                  { id: 'sparkles', icon: Sparkles, label: 'Sparkles' },
                  { id: 'zap', icon: Zap, label: 'Zap' },
                ].map(({ id, icon: Icon, label }) => (
                  <Button
                    key={id}
                    variant={formData.icon === id ? 'default' : 'ghost'}
                    onClick={() => setFormData({ ...formData, icon: id })}
                    className="flex flex-col items-center gap-1 py-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-1.5 rounded-md bg-muted border border-border focus:ring-1 focus:ring-ring text-sm"
              >
                <option value="">Select a category</option>
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="analysis">Analysis</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Capabilities</label>
              <div className="space-y-1.5">
                {['Code Generation', 'Code Review', 'Documentation', 'Testing'].map((cap) => (
                  <label key={cap} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.includes(cap)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            capabilities: [...formData.capabilities, cap],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            capabilities: formData.capabilities.filter((c) => c !== cap),
                          });
                        }
                      }}
                      className="rounded border-border bg-muted"
                    />
                    <span className="text-sm">{cap}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}