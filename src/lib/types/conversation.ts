export interface Conversation {
  id: string;
  title: string;
  timestamp: number;
}

export interface ConversationStore {
  conversations: Record<string, Conversation>;
  currentConversationId: string | null;
}

export type ConversationAction = 
  | { type: 'SET_CURRENT_CONVERSATION'; payload: string }
  | { type: 'CREATE_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_CONVERSATION'; payload: { id: string; updates: Partial<Conversation> } }
  | { type: 'DELETE_CONVERSATION'; payload: string };

export interface APIConversation {
  id: string;
  title: string;
  description: string | null;
  is_archived: boolean;
  organization_id: string;
  user_id: string;
  created_at: string;
}