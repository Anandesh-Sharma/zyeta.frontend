import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  side?: 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  isVisible: boolean;
}

export function Tooltip({ content, side = 'right', align = 'center', isVisible }: TooltipProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: side === 'right' ? -5 : 5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: side === 'right' ? -5 : 5 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={cn(
            'absolute z-50 px-2.5 py-1.5 rounded-md text-xs font-medium',
            'bg-background border border-border shadow-lg',
            side === 'right' ? 'left-full ml-2' : 'right-full mr-2',
            align === 'start' && 'top-0',
            align === 'center' && 'top-1/2 -translate-y-1/2',
            align === 'end' && 'bottom-0'
          )}
        >
          {content}
          <motion.div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-background border border-border',
              side === 'right' ? '-left-[4px] border-r-0 border-t-0' : '-right-[4px] border-l-0 border-b-0'
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}