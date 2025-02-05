import { atom } from 'recoil';
import { AssistantFilter, LLMModel } from '@/lib/types';

export const assistantFilterState = atom<AssistantFilter>({
  key: 'assistants/filterState',
  default: {
    searchQuery: '',
    category: 'all',
    capabilities: [],
    minRating: 0,
  },
});

export const recentAssistantsState = atom<string[]>({
  key: 'assistants/recentState',
  default: [],
});

export const llmModelsState = atom<LLMModel[]>({
  key: 'assistants/llmModelsState',
  default: [],
});

export const llmModelsLoadingState = atom<boolean>({
  key: 'assistants/llmModelsLoadingState',
  default: false,
});
