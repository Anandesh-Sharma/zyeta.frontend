export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  is_active: boolean;
  config: Record<string, any>;
}

export interface LLMStore {
  models: LLMModel[];
  isLoading: boolean;
  lastFetch: number | null;
}

export type LLMAction =
  | { type: 'SET_MODELS'; payload: LLMModel[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LAST_FETCH'; payload: number };