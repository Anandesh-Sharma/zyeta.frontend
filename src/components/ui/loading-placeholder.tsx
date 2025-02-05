import { cn } from '@/lib/utils';

interface LoadingPlaceholderProps {
  className?: string;
  count?: number;
  animate?: boolean;
  variant?: 'pulse' | 'shimmer';
}

export function LoadingPlaceholder({ 
  className, 
  count = 1, 
  animate = true,
  variant = 'shimmer'
}: LoadingPlaceholderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'relative overflow-hidden bg-muted/30 rounded',
            animate && variant === 'shimmer' && 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
            animate && variant === 'pulse' && 'animate-pulse',
            className
          )}
        />
      ))}
    </>
  );
}