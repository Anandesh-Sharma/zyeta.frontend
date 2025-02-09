import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ExecuteFinishStep() {
  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-lg grid place-items-center">
            <span className="text-xl">🎉</span>
          </div>
          <div>
            <h2 className="text-lg font-medium">Knowledge created</h2>
            <p className="text-sm text-muted-foreground">
              We automatically named the Knowledge, you can modify it at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Knowledge Details */}
      <Card className="p-4 space-y-4">
        {/* Knowledge Name */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Knowledge name</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg grid place-items-center shadow-sm">
              <span className="text-xl">🤖</span>
            </div>
            <span className="text-sm font-medium">Chainlit Documentation</span>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="space-y-3 pt-3 border-t">
          <h3 className="text-sm font-medium">Settings summary</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Chunk Settings */}
            <Card className="p-3 bg-accent/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg grid place-items-center shadow-sm">
                  <span className="text-base">📄</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Chunk Settings</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-normal">
                        500 chars
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-normal">
                        50 overlap
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Replace consecutive spaces, newlines and tabs
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Index Method */}
            <Card className="p-3 bg-accent/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg grid place-items-center shadow-sm">
                  <span className="text-base">⚡</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Index Method</h4>
                  <div className="flex items-center gap-1 text-xs">
                    <Badge variant="secondary" className="text-xs font-normal">
                      High Quality
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Retrieval Setting */}
            <Card className="p-3 bg-accent/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg grid place-items-center shadow-sm">
                  <span className="text-base">🔍</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Retrieval Setting</h4>
                  <div className="flex items-center gap-1 text-xs">
                    <Badge variant="secondary" className="text-xs font-normal">
                      Full-Text Search
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Processing Status */}
            <Card className="p-3 bg-accent/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg grid place-items-center shadow-sm">
                  <span className="text-base">✨</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground">Processing Status</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-normal bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                      Completed
                    </Badge>
                    <span className="text-xs text-muted-foreground">2 files processed</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  )
}