import { useState } from "react"
import { InfoIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tooltip } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function HybridSearch() {
  const [tooltips, setTooltips] = useState({
    hybrid: false,
    topK: false,
    threshold: false
  })
  const [rerankMethod, setRerankMethod] = useState<'weighted' | 'model'>('weighted')
  const [semanticWeight, setSemanticWeight] = useState(0.7)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <div className="w-5 h-5 grid place-items-center">
              <div className="w-3 h-3 bg-primary rounded-sm" />
            </div>
          </div>
          <h3 className="text-lg font-medium">Hybrid Search</h3>
          <div className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">RECOMMEND</div>
        </div>
        <div className="relative">
          <InfoIcon 
            className="h-4 w-4 text-muted-foreground cursor-help"
            onMouseEnter={() => setTooltips(prev => ({ ...prev, hybrid: true }))}
            onMouseLeave={() => setTooltips(prev => ({ ...prev, hybrid: false }))}
          />
          <Tooltip 
            isVisible={tooltips.hybrid}
            content="Execute full-text search and vector searches simultaneously, re-rank to select the best match for the user's query."
            side="right"
          />
        </div>
      </div>

      <div className="space-y-6">
        <RadioGroup 
          value={rerankMethod} 
          onValueChange={(value: 'weighted' | 'model') => setRerankMethod(value)}
          className="grid grid-cols-2 gap-4"
        >
          {[
            {
              value: 'weighted',
              title: 'Weighted Score',
              description: 'By adjusting the weights assigned, this rerank strategy determines whether to prioritize semantic or keyword matching.',
              icon: <div className="w-4 h-4 border-2 border-blue-500" />,
              iconBg: 'bg-blue-50'
            },
            {
              value: 'model',
              title: 'Rerank Model',
              description: 'Rerank model will reorder the candidate document list based on the semantic match with user query.',
              icon: (
                <div className="w-4 h-4 bg-green-500/20 rounded-full grid place-items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              ),
              iconBg: 'bg-green-50'
            }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRerankMethod(option.value as 'weighted' | 'model')}
              className={`w-full text-left border rounded-lg p-4 transition-colors hover:bg-accent/50 ${rerankMethod === option.value ? 'border-primary ring-2 ring-primary/20' : 'border-input'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-8 h-8 rounded-lg ${option.iconBg} grid place-items-center shrink-0`}>
                  {option.icon}
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium">{option.title}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </RadioGroup>

        {rerankMethod === 'weighted' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-blue-500">SEMANTIC {semanticWeight.toFixed(1)}</span>
                <span className="text-sm font-medium text-green-500">{(1 - semanticWeight).toFixed(1)} KEYWORD</span>
              </div>
              <Slider 
                value={[semanticWeight]} 
                onValueChange={([value]) => setSemanticWeight(value)}
                max={1}
                step={0.1}
                className="py-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Top K</Label>
                  <div className="relative">
                    <InfoIcon 
                      className="h-4 w-4 text-muted-foreground cursor-help"
                      onMouseEnter={() => setTooltips(prev => ({ ...prev, topK: true }))}
                      onMouseLeave={() => setTooltips(prev => ({ ...prev, topK: false }))}
                    />
                    <Tooltip 
                      isVisible={tooltips.topK}
                      content="Number of top results to return"
                      side="right"
                    />
                  </div>
                </div>
                <Input type="number" defaultValue={3} min={1} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Score Threshold</Label>
                  <div className="relative">
                    <InfoIcon 
                      className="h-4 w-4 text-muted-foreground cursor-help"
                      onMouseEnter={() => setTooltips(prev => ({ ...prev, threshold: true }))}
                      onMouseLeave={() => setTooltips(prev => ({ ...prev, threshold: false }))}
                    />
                    <Tooltip 
                      isVisible={tooltips.threshold}
                      content="Minimum score required for a result to be included"
                      side="right"
                    />
                  </div>
                </div>
                <Input type="number" defaultValue={0.5} step={0.1} min={0} max={1} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 