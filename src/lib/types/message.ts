export interface APIMessage {
  id: string;
  chat_session_id: string;
  role: 'USER' | 'AGENT';
  content: string;
  token_used: number;
  created_at: string;
  model_id: string;
  model_name: string;
  agent_id: string | null;
  agent_name: string | null;
}

export interface APIMessageResponse {
  messages: APIMessage[];
  total: number;
  has_more: boolean;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  model: string;
  status?: 'loading' | 'error';
  streaming?: boolean;
  sessionId: string;
  modelName?: string;
  agentName?: string | null;
  tokenUsed?: number;
}

export interface MessageStore {
  messages: Record<string, Message[]>;
  isResponding: Record<string, boolean>;
}

export type MessageAction =
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { conversationId: string; messageId: string; updates: Partial<Message> } }
  | { type: 'SET_RESPONDING'; payload: { conversationId: string; isResponding: boolean } }
  | { type: 'SET_MESSAGES'; payload: { conversationId: string; messages: Message[] } };