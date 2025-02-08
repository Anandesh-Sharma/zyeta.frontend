import type { Document } from '@/lib/types';

import { useRecoilCallback } from 'recoil';
import { documentAtomFamily, documentIdsByKnowledgeFamily } from '@/lib/store/documents';
import { useNetwork } from '../use-network';
import { mockDocuments } from '@/lib/mocks/documents';

const CACHE_DURATION = 5 * 60 * 1000;

export function useDocuments(knowledgeId: string) {
  const { makeRequest } = useNetwork();

  const getDocumentIds = useRecoilCallback(({ snapshot }) => () => {
    return snapshot.getLoadable(documentIdsByKnowledgeFamily(knowledgeId)).getValue();
  }, []);

  const fetchDocuments = useRecoilCallback(({ set }) => async (forceRefresh: boolean = false) => {
    // Using mock data instead of API call
    const response = mockDocuments.filter(doc => doc.knowledgeId === knowledgeId);
    
    set(documentIdsByKnowledgeFamily(knowledgeId), response.map(doc => doc.id));
    response.forEach(document => {
      set(documentAtomFamily(document.id), document);
    });

    return response;
  }, []);

  const createDocument = useRecoilCallback(({ set }) => async (document: Omit<Document, 'id'>) => {
    try {
      const response = await makeRequest<Document>(
        `/documents/create?knowledge_id=${knowledgeId}`,
        {
          method: 'POST',
          body: document
        }
      );

      set(documentAtomFamily(response.id), response);
      set(documentIdsByKnowledgeFamily(knowledgeId), (prev) => [...prev, response.id]);
      
      return response;
    } catch (err) {
      console.error('Failed to create document:', err);
      throw err;
    }
  }, []);

  const updateDocument = useRecoilCallback(({ set }) => (
    documentId: string, 
    updates: Partial<Document>
  ) => {
    set(documentAtomFamily(documentId), (prev) => ({ ...prev, ...updates }));
  }, []);

  const deleteDocument = useRecoilCallback(({ set, snapshot }) => async (documentId: string) => {
    const currentIds = await snapshot.getPromise(documentIdsByKnowledgeFamily(knowledgeId));
    set(documentIdsByKnowledgeFamily(knowledgeId), currentIds.filter(id => id !== documentId));
  }, []);

  return {
    getDocumentIds,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument
  };
} 