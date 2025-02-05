import { useNetwork } from './use-network';
import { useCallback } from 'react';
import { LLMModel } from '@/lib/types';
import { useRecoilState } from 'recoil';
import { llmModelsState, llmModelsLoadingState, llmModelsLastFetchState } from '../store/assistants/atoms';
import OrgState from '../store/organization/org-state';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useLLM() {
  const { makeRequest } = useNetwork();
  const [models, setModels] = useRecoilState(llmModelsState);
  const [isLoading, setIsLoading] = useRecoilState(llmModelsLoadingState);
  const [lastFetch, setLastFetch] = useRecoilState(llmModelsLastFetchState);

  const fetchModels = useCallback(async (force = false) => {
    const currentOrgId = OrgState.getCurrentOrg();
    
    if (!currentOrgId) {
      console.warn('No organization ID available');
      return [];
    }

    // If already loading, don't start another request
    if (isLoading) return models;

    try {
      setIsLoading(true);
      const response = await makeRequest<LLMModel[]>(
        `/api/llm/list?org_id=${currentOrgId}`,
        {
          cacheDuration: CACHE_DURATION,
          forceRefresh: force
        }
      );
      
      setModels(response);
      setLastFetch(Date.now());
      return response;
    } catch (err) {
      console.error('Failed to fetch LLM models:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [makeRequest, models, isLoading, setModels, setLastFetch, setIsLoading]);

  return {
    models,
    isLoading,
    fetchModels
  };
}