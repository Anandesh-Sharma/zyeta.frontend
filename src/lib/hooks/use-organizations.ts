import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { organizationsState, currentOrgIdState } from '../store/organization/atoms';
import { currentOrganizationState } from '../store/organization/selectors';
import { useNetwork } from './use-network';
import { useCallback } from 'react';
import { Organization } from '@/lib/types';
import { useLLM } from './use-llm';
import { useConversations } from './use-conversations';
import OrgState from '../store/organization/org-state';

export function useOrganizations() {
  const [organizations, setOrganizations] = useRecoilState(organizationsState);
  const setCurrentOrgId = useSetRecoilState(currentOrgIdState);
  const currentOrganization = useRecoilValue(currentOrganizationState);
  const { makeRequest } = useNetwork();
  const { fetchModels } = useLLM();
  const { fetchConversations } = useConversations();

  const fetchOrganizations = useCallback(async () => {
    try {
      const response = await makeRequest<Organization[]>('/org/list');
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }

      setOrganizations(response);
      
      const storedOrgId = OrgState.getCurrentOrg();
      let newOrgId: string;
      
      if (storedOrgId) {
        const orgExists = response.some(org => org.id === storedOrgId);
        newOrgId = orgExists ? storedOrgId : response[0]?.id;
      } else {
        newOrgId = response[0]?.id;
      }

      if (newOrgId) {
        OrgState.setCurrentOrg(newOrgId);
        setCurrentOrgId(newOrgId);
        // Initial fetch should always get fresh data
        await Promise.all([
          fetchModels(true),
          fetchConversations()
        ]);
      }

      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch organizations';
      console.error('Failed to fetch organizations:', { message });
      setOrganizations([]);
      throw err;
    }
  }, [makeRequest, setOrganizations, setCurrentOrgId, fetchModels, fetchConversations]);

  const switchOrganization = useCallback(async (orgId: string) => {
    OrgState.setCurrentOrg(orgId);
    setCurrentOrgId(orgId);
    
    // When switching orgs, use cache if available
    await Promise.all([
      fetchModels(false), // Use cache if available
      fetchConversations() // Fetch conversations for new org
    ]);
  }, [setCurrentOrgId, fetchModels, fetchConversations]);

  const addOrganization = useCallback(async (org: Organization, setAsCurrent = false) => {
    setOrganizations(prev => [...prev, org]);
    if (setAsCurrent) {
      OrgState.setCurrentOrg(org.id);
      setCurrentOrgId(org.id);
      // New organization should always get fresh data
      await Promise.all([
        fetchModels(true), // Force refresh for new org
        fetchConversations()
      ]);
    }
  }, [setOrganizations, setCurrentOrgId, fetchModels, fetchConversations]);

  return {
    organizations,
    currentOrganization,
    switchOrganization,
    addOrganization,
    fetchOrganizations
  };
}