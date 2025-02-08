import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Knowledge } from '@/lib/types';

interface CreateKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (knowledge: Omit<Knowledge, "id">) => Promise<Knowledge>;
}

export function CreateKnowledgeModal({ isOpen, onClose, onSubmit }: CreateKnowledgeModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    await onSubmit({
      name,
      description,
      documentCount: 0,
      wordCount: 0,
      linkedApps: 0,
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Knowledge Base">
      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </div>
    </Modal>
  );
} 