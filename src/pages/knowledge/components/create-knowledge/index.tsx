import { StepperModal, Stepper, type Step } from "@/components/ui/stepper"
import { DataSourceStep, DocumentProcessingStep, ExecuteFinishStep } from "./steps"
import { useState } from "react"
import { Knowledge } from "@/lib/types"

interface CreateKnowledgeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (knowledge: Omit<Knowledge, "id">) => Promise<Knowledge>
}

export function CreateKnowledgeModal({ isOpen, onClose, onSubmit }: CreateKnowledgeModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

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

  const handleComplete = () => {
    onSubmit({
      name: "Test Knowledge",
      description: "",
      documentCount: 0,
      wordCount: 0,
      linkedApps: 0,
      lastUpdated: new Date().toISOString()
    })
  }

  return (
    <StepperModal
      isOpen={isOpen}
      onClose={onClose}
      title="CREATE KNOWLEDGE"
      currentStep={currentStep}
      totalSteps={steps.length}
      onBack={() => setCurrentStep(prev => prev - 1)}
      onNext={() => setCurrentStep(prev => prev + 1)}
      onComplete={handleComplete}
      sidebar={
        <Stepper 
          steps={steps.map((step, i) => ({
            ...step,
            isCompleted: i < currentStep,
            isCurrent: i === currentStep
          }))} 
        />
      }
      continueText="Continue"
      completeText="Go to Knowledge"
    >
      {[
        <DataSourceStep key="data-source" />,
        <DocumentProcessingStep key="document-processing" />,
        <ExecuteFinishStep key="execute-finish" />
      ][currentStep]}
    </StepperModal>
  )
} 