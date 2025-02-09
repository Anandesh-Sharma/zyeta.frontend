import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { InfoIcon } from "lucide-react"
import { Tooltip } from "@/components/ui/tooltip"
import { useState } from "react"

export function ChunkSettings() {
  const [tooltips, setTooltips] = useState({
    general: false,
    delimiter: false,
    maxLength: false,
    overlap: false,
    rerank: false,
    vector: false,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">Chunk Settings</h3>
        <div className="relative">
          <InfoIcon 
            className="h-4 w-4 text-muted-foreground cursor-help"
            onMouseEnter={() => setTooltips(prev => ({ ...prev, general: true }))}
            onMouseLeave={() => setTooltips(prev => ({ ...prev, general: false }))}
          />
          <Tooltip 
            isVisible={tooltips.general}
            content="Configure how your document is split into chunks"
            side="right"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Delimiter */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Delimiter</Label>
            <div className="relative">
              <InfoIcon 
                className="h-3 w-3 text-muted-foreground cursor-help"
                onMouseEnter={() => setTooltips(prev => ({ ...prev, delimiter: true }))}
                onMouseLeave={() => setTooltips(prev => ({ ...prev, delimiter: false }))}
              />
              <Tooltip 
                isVisible={tooltips.delimiter}
                content="Character used to split the text into chunks"
                side="right"
              />
            </div>
          </div>
          <Input className="text-sm h-8" defaultValue="\n" />
        </div>

        {/* Maximum chunk length */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Maximum chunk length</Label>
            <div className="relative">
              <InfoIcon 
                className="h-3 w-3 text-muted-foreground cursor-help"
                onMouseEnter={() => setTooltips(prev => ({ ...prev, maxLength: true }))}
                onMouseLeave={() => setTooltips(prev => ({ ...prev, maxLength: false }))}
              />
              <Tooltip 
                isVisible={tooltips.maxLength}
                content="Maximum number of characters in each chunk"
                side="right"
              />
            </div>
          </div>
          <Input className="text-sm h-8" type="number" defaultValue={500} />
        </div>

        {/* Chunk overlap */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Chunk overlap</Label>
            <div className="relative">
              <InfoIcon 
                className="h-3 w-3 text-muted-foreground cursor-help"
                onMouseEnter={() => setTooltips(prev => ({ ...prev, overlap: true }))}
                onMouseLeave={() => setTooltips(prev => ({ ...prev, overlap: false }))}
              />
              <Tooltip 
                isVisible={tooltips.overlap}
                content="Number of characters to overlap between chunks"
                side="right"
              />
            </div>
          </div>
          <Input className="text-sm h-8" type="number" defaultValue={50} />
        </div>
      </div>

      {/* Text Pre-processing Rules */}
      <div className="space-y-2">
        <Label className="text-xs">Text Pre-processing Rules</Label>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox id="spaces" defaultChecked />
            <Label htmlFor="spaces" className="text-xs leading-tight">
              Replace consecutive spaces, newlines and tabs
            </Label>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="urls" />
            <Label htmlFor="urls" className="text-xs leading-tight">
              Delete all URLs and email addresses
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
} 