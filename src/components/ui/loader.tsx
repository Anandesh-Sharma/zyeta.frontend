import { motion } from 'framer-motion';
import { useTheme } from '@/lib/theme-provider';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function Loader({ size = 'md', fullScreen = false }: LoaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const circleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    }),
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={circleVariants}
                initial="hidden"
                animate="visible"
                className={`w-3 h-3 rounded-full ${isDark ? 'bg-primary/80' : 'bg-primary/60'}`}
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <h2 className="text-lg font-medium mb-2">Initializing App</h2>
            <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={circleVariants}
          initial="hidden"
          animate="visible"
          className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary/80' : 'bg-primary/60'}`}
        />
      ))}
    </div>
  );
}