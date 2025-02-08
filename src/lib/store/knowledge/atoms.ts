import { atom, atomFamily } from 'recoil';
import { Knowledge } from '@/lib/types';

export const knowledgeAtomFamily = atomFamily<Knowledge, string>({
  key: 'knowledge/knowledgeAtomFamily',
  default: (id) => ({
    id,
    name: '',
    description: '',
    documentCount: 0,
    wordCount: 0,
    linkedApps: 0,
    lastUpdated: new Date().toISOString()
  }),
});

export const knowledgeIdsAtomFamily = atomFamily<string[], string>({
  key: 'knowledge/knowledgeIdsByOrgFamily',
  default: [],
});

export const selectedKnowledgeIdAtom = atom<string | null>({
  key: 'knowledge/selectedKnowledgeId',
  default: null,
}); 