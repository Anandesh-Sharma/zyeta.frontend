import { cn } from "@/lib/utils"

interface Step {
  title: string
  description: string
  isCompleted: boolean
  isCurrent: boolean
}

const steps: Step[] = [
  {
    title: "DATA SOURCE",
    description: "Select your data source",
    isCompleted: false,
    isCurrent: true
  },
  {
    title: "DOCUMENT PROCESSING",
    description: "Configure processing options",
    isCompleted: false,
    isCurrent: false
  },
  {
    title: "EXECUTE & FINISH",
    description: "Review and create",
    isCompleted: false,
    isCurrent: false
  }
]

export function Stepper() {
  return (
    <div className="p-6 space-y-6">
      {steps.map((step, index) => (
        <div key={step.title} className="relative">
          {index !== 0 && (
            <div className="absolute left-[15px] -top-[30px] w-[2px] h-[30px] bg-border" />
          )}
          <div className="flex gap-4">
            <div className={cn(
              "w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center text-xs font-medium",
              step.isCompleted && "border-primary bg-primary text-primary-foreground",
              step.isCurrent && "border-primary",
              !step.isCompleted && !step.isCurrent && "border-muted-foreground"
            )}>
              {index + 1}
            </div>
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
        </div>
      ))}
    </div>
  )
} 