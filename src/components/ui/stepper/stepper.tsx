import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Step } from "./types"

interface StepperProps {
  steps: Step[]
}

export function Stepper({ steps }: StepperProps) {
  return (
    <div className="p-6 space-y-6">
      {steps.map((step, index) => (
        <motion.div 
          key={step.title} 
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {index !== 0 && (
            <motion.div 
              className="absolute left-[15px] -top-[30px] w-[2px] h-[30px] bg-border origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          )}
          <div className="flex gap-4">
            <motion.div 
              className={cn(
                "w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center text-xs font-medium",
                step.isCompleted && "border-primary bg-primary text-primary-foreground",
                step.isCurrent && "border-primary",
                !step.isCompleted && !step.isCurrent && "border-muted-foreground"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {index + 1}
            </motion.div>
            <div className="space-y-1">
              <h3 className={cn(
                "text-sm font-medium",
                step.isCurrent && "text-primary"
              )}>
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 