import { selector } from 'recoil';
import { assistantFilterState, llmModelsState } from './atoms';
import { Assistant, LLMModel } from '@/lib/types';
import { BotIcon } from 'lucide-react';

// Convert LLM model to assistant format
export function convertModelToAssistant(model: LLMModel) {
  return {
    id: model.id,
    name: model.name,
    description: `${model.provider} language model`,
    type: 'core' as const,
    icon: BotIcon,
  };
}

export const assistantsState = selector<Assistant[]>({
  key: 'assistants/allState',
  get: ({ get }) => {
    const llmModels = get(llmModelsState);
    // Convert LLM models to assistants
    const modelAssistants = llmModels.map(convertModelToAssistant);

    return [...modelAssistants];;
  },
});

export const filteredAssistantsState = selector<Assistant[]>({
  key: 'assistants/filteredState',
  get: ({ get }) => {
    const { searchQuery, category } = get(assistantFilterState);
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
        filteredAssistants = filteredAssistants.filter(a => a.type as string === 'specialized');
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

// export const currentSelectedAssistantSelector = selector<Assistant>({
//   key: 'assistants/currentSelectedAssistant',
//   get: ({ get }) => {
//     const models = get(llmModelsState);
//     const currentSelectedAssistant = get(currentActiveAssistantState);
//     const assistant = models.find(model => model.id === currentSelectedAssistant?.id);
//     return assistant;
//   },
// });