import { Label } from "@/components/ui/label"
import { Collapse } from "@/components/ui/collapse"
import { Select } from "@/components/ui/select"
import { RetrievalSettings } from "./retrieval-settings"

export function AdvancedSettings() {

  return (
    <Collapse title="Advanced Settings" defaultOpen={false} className="bg-muted/50">
      <div className="space-y-6">
        {/* Embedding Model */}
        <div className="space-y-2">
          <Label className="text-base">Embedding Model</Label>
          <Select defaultValue="text-embedding-3-large">
            <option value="text-embedding-3-large">text-embedding-3-large</option>
            <option value="text-embedding-3-small">text-embedding-3-small</option>
          </Select>
        </div>

        {/* Retrieval Settings */}
        <RetrievalSettings />
      </div>
    </Collapse>
  )
} 