import { Search, Plus, FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from 'react';
import { useDocuments } from '@/lib/hooks/use-documents';
import { useDocumentSelector } from '@/lib/hooks/use-documents';
import { CreateDocumentModal } from './create-document-modal';
import { Alert } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";

interface DocumentListProps {
  knowledgeId: string;
}

export function DocumentList({ knowledgeId }: DocumentListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const documents = useDocumentSelector('sortedDocuments');
  const { createDocument, deleteDocument, fetchDocuments } = useDocuments(knowledgeId);

  useEffect(() => {
    if (knowledgeId) {
      fetchDocuments();
    }
  }, [knowledgeId, fetchDocuments]);

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    setDocumentToDelete(null);
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8" />
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add file
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-[30px_40px_3fr_1fr_1fr_1fr_1.2fr_1fr_80px] gap-2 p-1.5 text-xs font-medium text-muted-foreground border-b bg-muted/50">
          <Checkbox />
          <div>#</div>
          <div>NAME</div>
          <div>MODE</div>
          <div>WORDS</div>
          <div>RETRIEVAL</div>
          <div>UPLOADED</div>
          <div>STATUS</div>
          <div className="text-right">ACTION</div>
        </div>

        <div className="divide-y">
          {documents.map((doc, index) => (
            <div 
              key={doc.id}
              className="grid grid-cols-[30px_40px_3fr_1fr_1fr_1fr_1.2fr_1fr_80px] gap-2 p-2 text-sm items-center hover:bg-muted/50"
            >
              <Checkbox />
              <div>{index + 1}</div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="truncate">{doc.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-2 py-1 rounded-full bg-muted text-xs">GENERAL</span>
              </div>
              <div>{doc.wordCount}</div>
              <div>0</div>
              <div>{formatDate(doc.lastUpdated)}</div>
              <div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  Available
                </span>
              </div>
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => setDocumentToDelete(doc.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateDocumentModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createDocument}
        knowledgeId={knowledgeId}
      />

      <Alert 
        isOpen={!!documentToDelete}
        onClose={() => setDocumentToDelete(null)}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={() => documentToDelete && handleDelete(documentToDelete)}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
} 