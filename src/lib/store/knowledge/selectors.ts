import { selector } from 'recoil';
import { knowledgeAtomFamily, knowledgeIdsAtomFamily, selectedKnowledgeIdAtom } from './atoms';
import { Knowledge } from '@/lib/types';
import OrgState from '../organization/org-state';

export const allKnowledgeState = selector<Knowledge[]>({
  key: 'knowledge/allKnowledgeState',
  get: ({ get }) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      console.warn('No organization ID available');
      return [];
    }
    const knowledgeIds = get(knowledgeIdsAtomFamily(orgId));
    return knowledgeIds.map(id => get(knowledgeAtomFamily(id)));
  },
});

export const currentKnowledgeState = selector<Knowledge | null>({
  key: 'knowledge/currentKnowledgeState',
  get: ({ get }) => {
    const currentId = get(selectedKnowledgeIdAtom);
    return currentId ? get(knowledgeAtomFamily(currentId)) : null;
  },
});

export const sortedKnowledgeState = selector<Knowledge[]>({
  key: 'knowledge/sortedKnowledgeState',
  get: ({ get }) => {
    const knowledge = get(allKnowledgeState);
    return [...knowledge].sort((a, b) => 
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  },
}); 