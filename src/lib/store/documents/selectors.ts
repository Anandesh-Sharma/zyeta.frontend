import { selector, selectorFamily } from 'recoil';
import { documentAtomFamily, documentIdsByKnowledgeFamily } from './atoms';
import { selectedKnowledgeIdAtom } from '../knowledge';
import { Document } from '@/lib/types';

export const allDocumentsState = selector<Document[]>({
  key: 'documents/allDocumentsState',
  get: ({ get }) => {
    const knowledgeId = get(selectedKnowledgeIdAtom);
    if (!knowledgeId) return [];
    
    const documentIds = get(documentIdsByKnowledgeFamily(knowledgeId));
    return documentIds.map(id => get(documentAtomFamily(id)));
  },
});

export const sortedDocumentsState = selector<Document[]>({
  key: 'documents/sortedDocumentsState',
  get: ({ get }) => {
    const documents = get(allDocumentsState);
    return [...documents].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  },
});

export const documentByIdState = selectorFamily<Document | null, string>({
  key: 'documents/documentByIdState',
  get: (id) => ({ get }) => {
    return get(documentAtomFamily(id));
  },
}); 