export interface ConversationState {
  id: string;
  title: string;
  model: string;
  timestamp: number;
}

export interface ConversationStore {
  conversations: Record<string, ConversationState>;
  currentConversationId: string | null;
}

export type ConversationAction = 
  | { type: 'SET_CURRENT_CONVERSATION'; payload: string }
  | { type: 'CREATE_CONVERSATION'; payload: ConversationState }
  | { type: 'UPDATE_CONVERSATION'; payload: { id: string; updates: Partial<ConversationState> } }
  | { type: 'DELETE_CONVERSATION'; payload: string };