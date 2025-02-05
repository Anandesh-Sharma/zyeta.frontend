export interface MessageState {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  model: string;
  status?: 'loading' | 'error';
  streaming?: boolean;
}

export interface MessagesByChat {
  [chatId: string]: MessageState[];
}