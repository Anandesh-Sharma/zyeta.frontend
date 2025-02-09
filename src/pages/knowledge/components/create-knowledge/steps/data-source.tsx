import { FileText, Globe, NotebookText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DataSourceStep() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Data Source</h3>
      
      <div className="grid gap-4">
        <Button 
          variant="ghost" 
          className="h-auto p-4 justify-start space-x-4"
        >
          <FileText className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Import from file</div>
            <div className="text-sm text-muted-foreground">
              Upload documents from your computer
            </div>
          </div>
        </Button>

        <Button 
          variant="ghost" 
          className="h-auto p-4 justify-start space-x-4"
        >
          <NotebookText className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Sync from Notion</div>
            <div className="text-sm text-muted-foreground">
              Import content from your Notion workspace
            </div>
          </div>
        </Button>

        <Button 
          variant="ghost" 
          className="h-auto p-4 justify-start space-x-4"
        >
          <Globe className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Sync from website</div>
            <div className="text-sm text-muted-foreground">
              Import content from a website URL
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
} 