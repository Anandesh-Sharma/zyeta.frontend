import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { InfoIcon } from "lucide-react"
import { Tooltip } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"

export function RetrievalSettings() {
  const [tooltips, setTooltips] = useState({
    general: false,
    rerank: false,
    topK: false,
    threshold: false,
  })
  const [selectedMethod, setSelectedMethod] = useState<'vector' | 'fullText' | 'hybrid'>('vector')
  const [rerankType, setRerankType] = useState<'weighted' | 'model'>('weighted')
  const [semanticWeight, setSemanticWeight] = useState(0.7)
  const [rerankEnabled, setRerankEnabled] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">Retrieval Setting</h3>
        <div className="relative">
          <InfoIcon 
            className="h-4 w-4 text-muted-foreground cursor-help"
            onMouseEnter={() => setTooltips(prev => ({ ...prev, general: true }))}
            onMouseLeave={() => setTooltips(prev => ({ ...prev, general: false }))}
          />
          <Tooltip 
            isVisible={tooltips.general}
            content="Choose how to retrieve relevant content"
            side="right"
          />
        </div>
      </div>

      <div className="space-y-3">
        {/* Vector Search */}
        <Card 
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            selectedMethod === 'vector' ? 'border-primary' : ''
          }`}
          onClick={() => setSelectedMethod('vector')}
        >
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-50 grid place-items-center shrink-0">
                <span className="text-lg">🎯</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Vector Search</h4>
                <p className="text-xs text-muted-foreground">
                  Generate query embeddings and search for the text chunk most similar to its vector representation.
                </p>
              </div>
            </div>

            {selectedMethod === 'vector' && (
              <div className="pl-10 space-y-3">
                <div className="flex items-center gap-2 relative">
                  <Label className="text-xs">Rerank Model</Label>
                  <div className="relative">
                    <InfoIcon 
                      className="h-3 w-3 text-muted-foreground cursor-help"
                      onMouseEnter={() => setTooltips(prev => ({ ...prev, rerank: true }))}
                      onMouseLeave={() => setTooltips(prev => ({ ...prev, rerank: false }))}
                    />
                    <Tooltip 
                      isVisible={tooltips.rerank}
                      content="Enable reranking of search results"
                      side="right"
                    />
                  </div>
                  <Switch 
                    className="ml-auto" 
                    checked={rerankEnabled}
                    onCheckedChange={setRerankEnabled}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Top K</Label>
                      <div className="relative">
                        <InfoIcon 
                          className="h-3 w-3 text-muted-foreground cursor-help"
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
                    <Input type="number" className="h-8 text-sm" defaultValue={3} min={1} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Score Threshold</Label>
                      <div className="relative">
                        <InfoIcon 
                          className="h-3 w-3 text-muted-foreground cursor-help"
                          onMouseEnter={() => setTooltips(prev => ({ ...prev, threshold: true }))}
                          onMouseLeave={() => setTooltips(prev => ({ ...prev, threshold: false }))}
                        />
                        <Tooltip 
                          isVisible={tooltips.threshold}
                          content="Minimum similarity score required"
                          side="right"
                        />
                      </div>
                    </div>
                    <Input 
                      type="number" 
                      className="h-8 text-sm"
                      defaultValue={0.5} 
                      step={0.1} 
                      min={0} 
                      max={1}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Full-Text Search */}
        <Card 
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            selectedMethod === 'fullText' ? 'border-primary bg-blue-50/10' : ''
          }`}
          onClick={() => setSelectedMethod('fullText')}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-lg grid place-items-center shrink-0">
              <span className="text-xl">📑</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-medium">Full-Text Search</h4>
              <p className="text-sm text-muted-foreground">
                Index all terms in the document, allowing users to search any term and retrieve relevant text chunk containing those terms.
              </p>
            </div>
          </div>

          {selectedMethod === 'fullText' && (
            <div className="mt-3 pl-[52px] space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Top K</Label>
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
                <Input type="number" className="h-9 text-sm" defaultValue={3} min={1} />
              </div>
            </div>
          )}
        </Card>

        {/* Hybrid Search */}
        <Card 
          className={`p-3 cursor-pointer hover:border-primary transition-colors ${
            selectedMethod === 'hybrid' ? 'border-primary' : ''
          }`}
          onClick={() => setSelectedMethod('hybrid')}
        >
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 grid place-items-center shrink-0">
                <span className="text-lg">🔄</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">Hybrid Search</h4>
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs">RECOMMEND</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Execute full-text search and vector searches simultaneously, re-rank to select the best match for the user's query.
                </p>
              </div>
            </div>

            {selectedMethod === 'hybrid' && (
              <div className="pl-10 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Weighted Score */}
                  <div 
                    className={`p-2 rounded-lg border bg-background space-y-1 cursor-pointer hover:border-primary ${
                      rerankType === 'weighted' ? 'border-primary' : ''
                    }`}
                    onClick={() => setRerankType('weighted')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 grid place-items-center">
                        <span className="text-base">⚖️</span>
                      </div>
                      <h5 className="text-xs font-medium">Weighted Score</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      By adjusting the weights assigned, this rerank strategy determines whether to prioritize semantic or keyword matching.
                    </p>
                  </div>

                  {/* Rerank Model */}
                  <div 
                    className={`p-2 rounded-lg border bg-background space-y-1 cursor-pointer hover:border-primary ${
                      rerankType === 'model' ? 'border-primary' : ''
                    }`}
                    onClick={() => setRerankType('model')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 grid place-items-center">
                        <span className="text-base">🔄</span>
                      </div>
                      <h5 className="text-xs font-medium">Rerank Model</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Rerank model will reorder the candidate document list based on the semantic match with user query.
                    </p>
                  </div>
                </div>

                {rerankType === 'weighted' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-blue-500">SEMANTIC {semanticWeight.toFixed(1)}</span>
                      <span className="font-medium text-emerald-500">{(1 - semanticWeight).toFixed(1)} KEYWORD</span>
                    </div>
                    <Slider 
                      value={[semanticWeight]} 
                      onValueChange={([value]) => setSemanticWeight(value)}
                      max={1}
                      step={0.1}
                      className="py-3"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Top K</Label>
                      <div className="relative">
                        <InfoIcon 
                          className="h-3 w-3 text-muted-foreground cursor-help"
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
                    <Input type="number" className="h-8 text-sm" defaultValue={3} min={1} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Score Threshold</Label>
                      <div className="relative">
                        <InfoIcon 
                          className="h-3 w-3 text-muted-foreground cursor-help"
                          onMouseEnter={() => setTooltips(prev => ({ ...prev, threshold: true }))}
                          onMouseLeave={() => setTooltips(prev => ({ ...prev, threshold: false }))}
                        />
                        <Tooltip 
                          isVisible={tooltips.threshold}
                          content="Minimum similarity score required"
                          side="right"
                        />
                      </div>
                    </div>
                    <Input 
                      type="number" 
                      className="h-8 text-sm"
                      defaultValue={0.5} 
                      step={0.1} 
                      min={0} 
                      max={1}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
} 