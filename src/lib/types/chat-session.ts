// Add new types for the API response
export interface ConversationWithSessions {
  id: string;
  title: string;
  description: string | null;
  is_archived: boolean;
  organization_id: string;
  user_id: string;
  created_at: string;
  chat_sessions: ChatSession[];
}

export interface ChatSession {
  id: string;
  conversation_id: string;
  agent_id: string | null;
  model_id: string;
  status: 'active' | 'ended';
  settings: Record<string, any>;
  created_at: string;
  model_name: string;
  agent_name: string | null;
}

export interface CreateChatSessionRequest {
  conversation_id: string;
  model_id: string;
}

export interface ChatSessionStore {
  sessions: Record<string, ChatSession>;
  currentSessionId: string | null;
}

export type ChatSessionAction = 
  | { type: 'SET_CURRENT_SESSION'; payload: string }
  | { type: 'CREATE_SESSION'; payload: ChatSession }
  | { type: 'UPDATE_SESSION'; payload: { id: string; updates: Partial<ChatSession> } }
  | { type: 'END_SESSION'; payload: string };