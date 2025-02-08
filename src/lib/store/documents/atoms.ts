import { atomFamily } from 'recoil';
import { Document } from '@/lib/types';

export const documentAtomFamily = atomFamily<Document, string>({
  key: 'documents/documentAtomFamily',
  default: (id) => ({
    id,
    name: '',
    type: '',
    wordCount: 0,
    lastUpdated: new Date().toISOString(),
    knowledgeId: ''
  }),
});

export const documentIdsByKnowledgeFamily = atomFamily<string[], string>({
  key: 'documents/documentIdsByKnowledgeFamily',
  default: [],
}); 