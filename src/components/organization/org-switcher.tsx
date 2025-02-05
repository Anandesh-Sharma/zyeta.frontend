import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Building2, Loader2, Settings } from 'lucide-react';
import { useOrganizations } from '@/lib/hooks/use-organizations';
import { CreateOrgModal } from './create-org-modal';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function OrgSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { organizations, currentOrganization, switchOrganization } = useOrganizations();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!organizations.length) {
    return (
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Building2 className="h-5 w-5 text-primary" />
      </div>
    );
  }

  if (!currentOrganization) return null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-lg hover:bg-accent transition-colors duration-200 group"
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              {currentOrganization.logo ? (
                <img 
                  src={currentOrganization.logo} 
                  alt={currentOrganization.name}
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <span className="text-base font-semibold">
                  {currentOrganization.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-full top-0 ml-2 w-[280px] bg-popover border border-border rounded-lg shadow-lg z-50"
            >
              <div className="p-2">
                <h3 className="text-sm font-medium px-2 mb-3">Organizations</h3>
                <div className="max-h-[300px] overflow-y-auto space-y-1 mb-2">
                  {organizations.map(org => (
                    <button
                      key={org.id}
                      onClick={() => {
                        switchOrganization(org.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors",
                        org.id === currentOrganization.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
                        {org.logo ? (
                          <img 
                            src={org.logo} 
                            alt={org.name}
                            className="h-full w-full rounded-md object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {org.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{org.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{org.slug}</div>
                      </div>
                      {org.id === currentOrganization.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border p-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-accent rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Organization</span>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/settings/organization');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Organization Settings</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateOrgModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}