import { selector } from 'recoil';
import { assistantFilterState, recentAssistantsState, llmModelsState } from './atoms';
import { convertModelToAssistant } from '@/lib/constants/chat';
import { Assistant } from '@/lib/types';

export const filteredAssistantsState = selector<Assistant[]>({
  key: 'assistants/filteredState',
  get: ({ get }) => {
    const { searchQuery, category } = get(assistantFilterState);
    const recentAssistants = get(recentAssistantsState);
    const llmModels = get(llmModelsState);

    // Convert LLM models to assistants
    const modelAssistants = llmModels.map(convertModelToAssistant);

    let filteredAssistants = [...modelAssistants];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredAssistants = filteredAssistants.filter(assistant => 
        assistant.name.toLowerCase().includes(query) ||
        assistant.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    switch (category) {
      case 'agents':
        filteredAssistants = filteredAssistants.filter(a => a.type === 'specialized');
        break;
      case 'models':
        filteredAssistants = filteredAssistants.filter(a => a.type === 'core');
        break;
      case 'top':
        // Show all models for now
        break;
      case 'trending':
        // Show all models for now
        break;
      case 'new':
        // Show all models for now
        break;
    }

    return filteredAssistants;
  },
});