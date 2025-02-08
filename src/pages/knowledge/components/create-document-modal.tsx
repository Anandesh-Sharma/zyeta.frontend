import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Document } from '@/lib/types';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (document: Omit<Document, "id">) => Promise<Document>;
  knowledgeId: string;
}

export function CreateDocumentModal({ isOpen, onClose, onSubmit, knowledgeId }: CreateDocumentModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  const handleSubmit = async () => {
    await onSubmit({
      name,
      type,
      wordCount: 0,
      lastUpdated: new Date().toISOString(),
      knowledgeId
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Document">
      <div className="space-y-4">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </div>
    </Modal>
  );
} 