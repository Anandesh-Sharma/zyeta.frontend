import { useState, useEffect } from 'react';
import { CreateKnowledgeModal } from './components/create-knowledge';
import { KnowledgeSidebar } from './components/knowledge-sidebar';
import { DocumentList } from './components/document-list';
import { useKnowledgeSelector } from '@/lib/hooks/use-knowledge';
import { useKnowledge } from '@/lib/hooks/use-knowledge';

export function KnowledgePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const knowledge = useKnowledgeSelector('sortedKnowledge', 'get');
  const currentKnowledge = useKnowledgeSelector('currentKnowledge', 'get');
  const { createKnowledge, deleteKnowledge, fetchKnowledge, setSelectedKnowledgeId } = useKnowledge();

  useEffect(() => {
    fetchKnowledge();
  }, [fetchKnowledge]);

  return (
    <div className="ml-[56px] flex h-screen">
      <KnowledgeSidebar
        knowledgeBases={knowledge}
        selectedKnowledge={currentKnowledge?.id || null}
        onSelectKnowledge={setSelectedKnowledgeId}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onDeleteKnowledge={deleteKnowledge}
      />

      {currentKnowledge ? (
        <DocumentList knowledgeId={currentKnowledge.id} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a knowledge base to view its documents
        </div>
      )}

      <CreateKnowledgeModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createKnowledge}
      />
    </div>
  );
} 