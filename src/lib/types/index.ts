export * from './organization';
export * from './conversation';
export * from './message';
export * from './llm';
export * from './assistant';
export * from './knowledge';
export * from './document';
export * from './hooks';
export * from './chat-session';
// Network types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cacheDuration?: number;
  forceRefresh?: boolean;
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

export interface CacheOptions {
  duration?: number;
  namespace?: string;
}