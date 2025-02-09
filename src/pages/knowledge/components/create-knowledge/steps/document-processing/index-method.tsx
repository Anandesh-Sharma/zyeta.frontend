import { useState } from "react"
import { InfoIcon } from "lucide-react"
import { Tooltip } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"

export function IndexMethod() {
  const [tooltips, setTooltips] = useState({
    general: false,
    highQuality: false,
    economical: false
  })
  const [selectedMethod, setSelectedMethod] = useState<'high' | 'eco'>('high')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">Index Method</h3>
        <div className="relative">
          <InfoIcon 
            className="h-4 w-4 text-muted-foreground cursor-help"
            onMouseEnter={() => setTooltips(prev => ({ ...prev, general: true }))}
            onMouseLeave={() => setTooltips(prev => ({ ...prev, general: false }))}
          />
          <Tooltip 
            isVisible={tooltips.general}
            content="Choose how to index your document for retrieval"
            side="right"
          />
        </div>
      </div>

      <div className="grid gap-3">
        {/* High Quality */}
        <Card 
          className={`p-3 cursor-pointer hover:bg-accent/50 transition-all ${
            selectedMethod === 'high' ? 'bg-accent border-primary shadow-sm' : ''
          }`}
          onClick={() => setSelectedMethod('high')}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-lg grid place-items-center shrink-0 shadow-sm">
              <span className="text-xl">⚡</span>
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">High Quality</h4>
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">RECOMMEND</span>
                </div>
                <div className="relative">
                  <InfoIcon 
                    className="h-3 w-3 text-muted-foreground cursor-help"
                    onMouseEnter={() => setTooltips(prev => ({ ...prev, highQuality: true }))}
                    onMouseLeave={() => setTooltips(prev => ({ ...prev, highQuality: false }))}
                  />
                  <Tooltip 
                    isVisible={tooltips.highQuality}
                    content="Calling the embedding model to process documents for more precise retrieval helps LLM generate high-quality answers."
                    side="right"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Calling the embedding model to process documents for more precise retrieval helps LLM generate high-quality answers.
              </p>
            </div>
          </div>
        </Card>

        {/* Economical */}
        <Card 
          className={`p-3 cursor-pointer hover:bg-accent/50 transition-all ${
            selectedMethod === 'eco' ? 'bg-accent border-primary shadow-sm' : ''
          }`}
          onClick={() => setSelectedMethod('eco')}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-lg grid place-items-center shrink-0 shadow-sm">
              <span className="text-xl">💰</span>
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Economical</h4>
                <div className="relative">
                  <InfoIcon 
                    className="h-3 w-3 text-muted-foreground cursor-help"
                    onMouseEnter={() => setTooltips(prev => ({ ...prev, economical: true }))}
                    onMouseLeave={() => setTooltips(prev => ({ ...prev, economical: false }))}
                  />
                  <Tooltip 
                    isVisible={tooltips.economical}
                    content="Using 10 keywords per chunk for retrieval, 50 tokens are consumed at the expense of reduced retrieval accuracy."
                    side="right"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Using 10 keywords per chunk for retrieval, 50 tokens are consumed at the expense of reduced retrieval accuracy.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 