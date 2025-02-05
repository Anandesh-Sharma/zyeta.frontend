import { Bot, Sparkles, Zap, Brain, Hash, Plus } from 'lucide-react';
import { CommandItem } from './types';
import type { LucideIcon } from 'lucide-react';

export const COMMANDS: (Omit<CommandItem, 'icon'> & { icon: LucideIcon })[] = [
  {
    id: 'gpt-4',
    type: 'model',
    title: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    icon: Sparkles,
  },
  {
    id: 'gpt-3.5',
    type: 'model',
    title: 'GPT-3.5',
    description: 'Fast and versatile',
    icon: Zap,
  },
  {
    id: 'coding-assistant',
    type: 'agent',
    title: 'Coding Assistant',
    description: 'Expert in code review and development',
    icon: Bot,
  },
  {
    id: 'researcher',
    type: 'agent',
    title: 'Research Assistant',
    description: 'Helps with research and analysis',
    icon: Brain,
  },
  {
    id: 'new-chat',
    type: 'action',
    title: 'Create new chat',
    description: 'Start a new conversation',
    icon: Plus,
    shortcut: '⌘N',
  },
  {
    id: 'add-tag',
    type: 'action',
    title: 'Add tag',
    description: 'Organize chats with custom tags',
    icon: Hash,
    shortcut: '⌘T',
  },
];