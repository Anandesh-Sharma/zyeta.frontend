import { Modal } from "../modal"
import { StepLayout } from "./step-layout"
import { Button } from "../button"
import { motion, AnimatePresence } from "framer-motion"

interface StepperModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  icon?: React.ComponentType<any>
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  onComplete: () => void
  sidebar: React.ReactNode
  children: React.ReactNode
  continueText?: string
  completeText?: string
}

export function StepperModal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onComplete,
  sidebar,
  children,
  continueText = "Continue",
  completeText = "Complete"
}: StepperModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      showClose={true}
      title={title}
      description={description}
      icon={Icon && <Icon className="h-6 w-6" />}
      footer={
        <>
          {currentStep > 0 && (
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
          )}
          {currentStep < totalSteps - 1 ? (
            <Button onClick={onNext}>
              {continueText}
            </Button>
          ) : (
            <Button onClick={onComplete}>
              {completeText}
            </Button>
          )}
        </>
      }
    >
      <StepLayout
        sidebar={sidebar}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </StepLayout>
    </Modal>
  )
} 