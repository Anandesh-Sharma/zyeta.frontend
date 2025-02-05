import { AlertTriangle } from 'lucide-react';
import { Modal } from './modal';
import { Button } from './button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmationModalProps) {
  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        {cancelText}
      </Button>
      <Button 
        variant={type === 'danger' ? 'destructive' : 'default'}
        onClick={() => {
          onConfirm();
          onClose();
        }}
      >
        {confirmText}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={title}
      description={description}
      icon={
        <AlertTriangle className={`h-5 w-5 ${
          type === 'danger' ? 'text-destructive-foreground' : 'text-primary-foreground'
        }`} />
      }
      footer={footer}
    >
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Modal>
  );
}