import { motion } from "framer-motion"

interface StepLayoutProps {
  children: React.ReactNode
  title?: string
  sidebar?: React.ReactNode
}

export function StepLayout({ 
  children, 
  title,
  sidebar,
}: StepLayoutProps) {
  return (
    <div className="grid grid-cols-[280px_1fr] h-[600px]">
      <div className="border-r bg-muted/50 sticky top-0 h-[600px] overflow-y-auto">
        {sidebar}
      </div>
      <div className="flex flex-col overflow-y-auto">
        <motion.div 
          className="flex-1 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {title && (
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>
          )}
          {children}
        </motion.div>
      </div>
    </div>
  )
} 