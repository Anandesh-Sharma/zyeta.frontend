import { 
  Bot, 
  Sparkles,
  Brain,
  Palette,
  Code,
  FileCode,
  Search,
  Shield,
  Database,
  Globe,
  Cloud,
  Terminal,
  Settings,
  PenTool,
  Cpu,
  BarChart2,
  LineChart,
  PieChart,
  GitBranch,
  Box,
  Layers,
  Share2,
  Workflow,
  Network,
  Lightbulb,
  Coffee,
  Compass,
  Rocket,
  Microscope,
  FlaskConical,
  Target,
  Gauge,
  Laptop,
  Server 
} from 'lucide-react';
import { LLMModel } from '../types';

// Default assistant to use as fallback
export const DEFAULT_ASSISTANT = {
  id: 'gpt-3.5-turbo',
  name: 'GPT-3.5',
  description: 'Fast and versatile',
  type: 'core',
  icon: Bot,
};

// Map model IDs to display names
const MODEL_NAMES: Record<string, string> = {
  'gpt-3.5-turbo': 'GPT-3.5',
  'gpt-4': 'GPT-4',
  'gpt-4-turbo': 'GPT-4 Turbo',
  'claude-2': 'Claude 2',
  'claude-instant': 'Claude Instant',
  'mistral-7b': 'Mistral 7B',
  'llama-2': 'Llama 2',
};

// Map model IDs to icons
const MODEL_ICONS: Record<string, any> = {
  'gpt-3.5-turbo': Bot,
  'gpt-4': Sparkles,
  'gpt-4-turbo': Brain,
  'claude-2': Cpu,
  'claude-instant': Rocket,
  'mistral-7b': Cloud,
  'llama-2': Brain,
};

// Map model IDs to descriptions
const MODEL_DESCRIPTIONS: Record<string, string> = {
  'gpt-3.5-turbo': 'Fast and versatile language model',
  'gpt-4': 'Most capable model, best for complex tasks',
  'gpt-4-turbo': 'Latest GPT-4 model with improved capabilities',
  'claude-2': 'Advanced reasoning and analysis',
  'claude-instant': 'Fast and efficient responses',
  'mistral-7b': 'Open source language model',
  'llama-2': 'Meta\'s open source LLM',
};

// Helper function to safely get an assistant from LLM model
export function getAssistant(modelId: string) {
  return {
    id: modelId,
    name: MODEL_NAMES[modelId] || modelId,
    description: MODEL_DESCRIPTIONS[modelId] || 'AI Language Model',
    type: 'core',
    icon: MODEL_ICONS[modelId] || Bot,
  };
}

// Convert LLM model to assistant format
export function convertModelToAssistant(model: LLMModel) {
  return {
    id: model.id,
    name: MODEL_NAMES[model.id] || model.name,
    description: MODEL_DESCRIPTIONS[model.id] || `${model.provider} language model`,
    type: 'core' as const,
    icon: MODEL_ICONS[model.id] || Bot,
  };
}

// Core assistants (like GPT-3, GPT-4)
export const CORE_ASSISTANTS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    type: 'core',
    icon: Sparkles,
  },
  DEFAULT_ASSISTANT,
] as const;

// Specialized assistants
export const SPECIALIZED_ASSISTANTS = [
  {
    id: 'coding-assistant',
    name: 'Coding Assistant',
    description: 'Expert in code review and development',
    type: 'specialized',
    icon: Code,
  },
  {
    id: 'tech-writer',
    name: 'Technical Writer',
    description: 'Specialized in documentation and technical writing',
    type: 'specialized',
    icon: FileCode,
  },
  {
    id: 'researcher',
    name: 'Research Assistant',
    description: 'Helps with research and analysis',
    type: 'specialized',
    icon: Brain,
  },
  {
    id: 'creative',
    name: 'Creative Assistant',
    description: 'Helps with creative writing and brainstorming',
    type: 'specialized',
    icon: Palette,
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Specializes in data analysis and visualization',
    type: 'specialized',
    icon: BarChart2,
  },
  {
    id: 'cloud-expert',
    name: 'Cloud Expert',
    description: 'Expert in cloud architecture and DevOps',
    type: 'specialized',
    icon: Cloud,
  },
  {
    id: 'security-advisor',
    name: 'Security Advisor',
    description: 'Specializes in cybersecurity and best practices',
    type: 'specialized',
    icon: Shield,
  },
  {
    id: 'database-expert',
    name: 'Database Expert',
    description: 'Expert in database design and optimization',
    type: 'specialized',
    icon: Database,
  }
] as const;

export const ALL_ASSISTANTS = [...CORE_ASSISTANTS, ...SPECIALIZED_ASSISTANTS];