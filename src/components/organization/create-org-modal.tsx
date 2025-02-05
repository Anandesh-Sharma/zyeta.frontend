import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useNetwork } from '@/lib/hooks/use-network';
import { useOrganizations } from '@/lib/hooks/use-organizations';
import { Organization } from '@/lib/types';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrgModal({ isOpen, onClose }: CreateOrgModalProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { makeRequest } = useNetwork();
  const { addOrganization } = useOrganizations();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newOrg = await makeRequest<Organization>(`/org/create_org?name=${encodeURIComponent(name.trim())}`, {
        method: 'POST'
      });

      // Add the new org to state and set it as current
      await addOrganization(newOrg, true);
      
      // Reset form and close modal
      setName('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button 
        onClick={handleSubmit}
        disabled={isLoading || !name.trim()}
        isLoading={isLoading}
      >
        Create Organization
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Organization"
      description="Create a new organization to manage your workspaces and team members."
      icon={<Building2 className="h-5 w-5 text-primary-foreground" />}
      footer={footer}
    >
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Organization Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder="Enter organization name"
            className="w-full px-3 py-2 rounded-md bg-muted border border-border text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            disabled={isLoading}
          />
          {error && (
            <p className="mt-1.5 text-sm text-destructive">{error}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}