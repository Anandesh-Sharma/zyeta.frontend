import { Bot, Sparkles, Zap, Brain, Palette, Code, FileCode, BookOpen } from 'lucide-react';

// Base assistant types
export type AssistantType = 'core' | 'specialized';
export type AssistantCapability = 'code' | 'writing' | 'research' | 'analysis' | 'creative';

// Default assistant to use as fallback
export const DEFAULT_ASSISTANT = {
  id: 'gpt-3.5',
  name: 'GPT-3.5',
  description: 'Fast and versatile',
  type: 'core' as AssistantType,
  capabilities: ['writing', 'analysis'] as AssistantCapability[],
  icon: Bot,
};

// Core assistants (like GPT-3, GPT-4)
export const CORE_ASSISTANTS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    type: 'core',
    capabilities: ['writing', 'analysis', 'code', 'research', 'creative'],
    icon: Sparkles,
  },
  DEFAULT_ASSISTANT,
] as const;

// Specialized assistants (like coding assistant, writer, etc)
export const SPECIALIZED_ASSISTANTS = [
  {
    id: 'coding-assistant',
    name: 'Coding Assistant',
    description: 'Expert in code review and development',
    type: 'specialized',
    capabilities: ['code'],
    icon: Code,
  },
  {
    id: 'tech-writer',
    name: 'Technical Writer',
    description: 'Specialized in documentation and technical writing',
    type: 'specialized',
    capabilities: ['writing'],
    icon: FileCode,
  },
  {
    id: 'researcher',
    name: 'Research Assistant',
    description: 'Helps with research and analysis',
    type: 'specialized',
    capabilities: ['research', 'analysis'],
    icon: Brain,
  },
  {
    id: 'creative',
    name: 'Creative Assistant',
    description: 'Helps with creative writing and brainstorming',
    type: 'specialized',
    capabilities: ['creative', 'writing'],
    icon: Palette,
  },
] as const;

export const ALL_ASSISTANTS = [...CORE_ASSISTANTS, ...SPECIALIZED_ASSISTANTS];

// Helper function to safely get an assistant
export function getAssistant(assistantId: string) {
  return ALL_ASSISTANTS.find(a => a.id === assistantId) || DEFAULT_ASSISTANT;
}