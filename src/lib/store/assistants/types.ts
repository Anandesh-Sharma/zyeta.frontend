export type AssistantType = 'core' | 'specialized';
export type AssistantCategory = 'all' | 'agents' | 'models' | 'top' | 'trending' | 'new' | 'coding' | 'writing' | 'analysis' | 'creative' | 'research' | 'productivity';

export interface Assistant {
  id: string;
  name: string;
  description: string;
  type: AssistantType;
  icon: any;
  rating?: number;
  usageCount?: string;
  tags?: string[];
  credits?: string;
}

export interface AssistantFilter {
  searchQuery: string;
  category: AssistantCategory;
  capabilities: string[];
  minRating: number;
}