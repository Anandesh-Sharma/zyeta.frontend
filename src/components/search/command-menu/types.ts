import type { LucideIcon } from 'lucide-react';
import type { Conversation } from '@/lib/types';

export type CommandItemType = 'model' | 'agent' | 'action' | 'chat';

export interface CommandItem {
  id: string;
  type: CommandItemType;
  title: string;
  description: string;
  icon: LucideIcon;
  shortcut?: string;
  conversation?: Conversation;
}

export interface CommandGroup {
  title: string;
  items: CommandItem[];
}