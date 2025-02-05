import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showClose?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-[1200px] w-[90vw]',
  full: 'max-w-[90vw]'
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  size = 'md',
  showClose = true,
  className
}: ModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="min-h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className={cn(
                "relative transform rounded-lg bg-background shadow-xl border border-border flex flex-col max-h-[85vh]",
                sizeClasses[size],
                className
              )}
            >
              {/* Header - Fixed */}
              {(title || description || icon) && (
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    {icon && (
                      <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                        {icon}
                      </div>
                    )}
                    <div>
                      {title && <h2 className="text-lg font-medium">{title}</h2>}
                      {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    </div>
                  </div>
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {children}
              </div>

              {/* Footer - Fixed */}
              {footer && (
                <div className="flex-shrink-0 flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-muted/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}