import { ChunkSettings } from "./chunk-settings"
import { AdvancedSettings } from "./advanced-settings"
import { IndexMethod } from "./index-method"

export function DocumentProcessingStep() {
  return (
    <div className="space-y-8">
      <ChunkSettings />
      <IndexMethod />
      <AdvancedSettings />
    </div>
  )
} 