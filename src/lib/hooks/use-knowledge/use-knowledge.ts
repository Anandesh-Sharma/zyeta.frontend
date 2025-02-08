import { useRecoilCallback } from 'recoil';
import { currentKnowledgeState, knowledgeAtomFamily, knowledgeIdsAtomFamily, selectedKnowledgeIdAtom } from '@/lib/store/knowledge';
import { Knowledge } from '@/lib/types';
import { useNetwork } from '../use-network';
import OrgState from '@/lib/store/organization/org-state';
import { mockKnowledge } from '@/lib/mocks/knowledge';

const CACHE_DURATION = 5 * 60 * 1000;

export function useKnowledge() {
  const { makeRequest } = useNetwork();

  const getCurrentKnowledge = useRecoilCallback(({ snapshot }) => () => {
    return snapshot.getLoadable(currentKnowledgeState).getValue();
  }, []);

  const getKnowledgeIds = useRecoilCallback(({ snapshot }) => (orgId: string) => {
    return snapshot.getLoadable(knowledgeIdsAtomFamily(orgId)).getValue();
  }, []);

  const fetchKnowledge = useRecoilCallback(({ set }) => async (forceRefresh: boolean = false) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) {
      console.warn('No organization ID available');
      return [];
    }

    // Using mock data instead of API call
    const response = mockKnowledge;
    
    set(knowledgeIdsAtomFamily(orgId), response.map(k => k.id));
    response.forEach(knowledge => {
      set(knowledgeAtomFamily(knowledge.id), knowledge);
    });

    return response;
  }, []);

  const createKnowledge = useRecoilCallback(({ set }) => async (knowledge: Omit<Knowledge, 'id'>) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) throw new Error('No organization ID available');

    try {
      const response = await makeRequest<Knowledge>(
        `/knowledge/create?org_id=${orgId}`,
        {
          method: 'POST',
          body: knowledge
        }
      );

      set(knowledgeAtomFamily(response.id), response);
      set(knowledgeIdsAtomFamily(orgId), (prev) => [...prev, response.id]);
      set(selectedKnowledgeIdAtom, response.id);
      
      return response;
    } catch (err) {
      console.error('Failed to create knowledge:', err);
      throw err;
    }
  }, [makeRequest]);

  const updateKnowledge = useRecoilCallback(({ set }) => (
    knowledgeId: string, 
    updates: Partial<Knowledge>
  ) => {
    set(knowledgeAtomFamily(knowledgeId), (prev) => ({ ...prev, ...updates }));
  }, []);

  const deleteKnowledge = useRecoilCallback(({ set, snapshot }) => async (knowledgeId: string) => {
    const orgId = OrgState.getCurrentOrg();
    if (!orgId) return;

    const currentIds = await snapshot.getPromise(knowledgeIdsAtomFamily(orgId));
    set(knowledgeIdsAtomFamily(orgId), currentIds.filter(id => id !== knowledgeId));
    
    const currentId = await snapshot.getPromise(selectedKnowledgeIdAtom);
    if (currentId === knowledgeId) {
      const nextId = currentIds.find(id => id !== knowledgeId) || null;
      set(selectedKnowledgeIdAtom, nextId);
    }
  }, []);

  const setSelectedKnowledgeId = useRecoilCallback(({ set }) => async (id: string) => {
    set(selectedKnowledgeIdAtom, id);
  }, []);

  return {
    getCurrentKnowledge,
    getKnowledgeIds,
    fetchKnowledge,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge,
    setSelectedKnowledgeId
  };
} 