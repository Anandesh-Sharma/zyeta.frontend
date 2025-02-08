import { FolderPlus, FileText, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Knowledge } from '@/lib/types';

interface KnowledgeSidebarProps {
  knowledgeBases: Knowledge[];
  selectedKnowledge: string | null;
  onSelectKnowledge: (id: string) => void;
  onCreateClick: () => void;
  onDeleteKnowledge?: (id: string) => void;
}

export function KnowledgeSidebar({ 
  knowledgeBases, 
  selectedKnowledge,
  onSelectKnowledge,
  onCreateClick,
  onDeleteKnowledge
}: KnowledgeSidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <button
          onClick={onCreateClick}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
        >
          <FolderPlus className="h-4 w-4" />
          Create Knowledge
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {knowledgeBases.map((kb) => (
          <div
            key={kb.id}
            className={cn(
              'w-full flex items-center gap-2 px-4 py-2 text-sm text-left group hover:bg-muted/50 transition-colors cursor-pointer',
              selectedKnowledge === kb.id && 'bg-muted'
            )}
            onClick={() => onSelectKnowledge(kb.id)}
          >
            <FileText className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 truncate">
              <div className="truncate">{kb.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {kb.documentCount} docs
              </div>
            </div>
            {selectedKnowledge === kb.id && onDeleteKnowledge && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteKnowledge(kb.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 