import axios from 'axios';
import { API_HOST, API_TOKEN } from '@/lib/env';
import { useCache } from '@/lib/cache/cache';
import { ApiError, RequestOptions } from '@/lib/types';
import { useCallback } from 'react';

export function useNetwork() {
  const cache = useCache();

  const handleError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || error.message,
        code: error.response?.status?.toString(),
        details: error.response?.data
      };
      throw apiError;
    }
    throw error;
  };

  const generateCacheKey = (endpoint: string, options: RequestOptions = {}) => {
    const { method = 'GET', body } = options;
    return JSON.stringify({
      method: method.toLowerCase(),
      url: `${API_HOST}${endpoint}`,
      body,
    });
  };

  const makeRequest = useCallback(async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers = {}, cacheDuration, forceRefresh } = options;

    // Only cache GET requests
    if (method === 'GET' && !forceRefresh) {
      const cacheKey = generateCacheKey(endpoint, options);
      const cachedData = cache.get<T>(cacheKey, { duration: cacheDuration });
      
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      const response = await axios({
        method,
        url: `${API_HOST}/api${endpoint}`,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
          'ngrok-skip-browser-warning': '69420',
          ...headers,
        },
      });

      // Cache successful GET responses
      if (method === 'GET') {
        const cacheKey = generateCacheKey(endpoint, options);
        cache.set(cacheKey, response.data, { duration: cacheDuration });
      }

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  }, [cache]);

  const makeStreamRequest = useCallback(async (endpoint: string, options: RequestOptions = {}, onChunk: (chunk: string) => void) => {
    const { method = 'GET', body, headers = {} } = options;

    let buffer = '';

    try {
      const response = await axios({
        method,
        url: `${API_HOST}/api${endpoint}`,
        data: body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
          'ngrok-skip-browser-warning': '69420',
          ...headers,
        },
        responseType: 'stream',
        onDownloadProgress: (progressEvent) => {
          const chunk = progressEvent.event.target as XMLHttpRequest;
          if (chunk.responseText) {
            const newText = chunk.responseText.slice(buffer.length);
            buffer = chunk.responseText;

            const lines = newText.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = line.slice(6);
                  if (data === '{"message": "DONE"}') continue;
                  
                  const parsed = JSON.parse(data);
                  if (parsed.message && typeof parsed.message === 'string') {
                    const cleanMessage = parsed.message
                      .replace(/\\u[\dA-F]{4}/gi, (match: string) => 
                        String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
                      )
                      .replace(/\\n/g, '\n');
                    
                    onChunk(cleanMessage);
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', {
                    message: e instanceof Error ? e.message : String(e)
                  });
                }
              }
            }
          }
        },
      });

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }, []);

  const clearCache = () => {
    cache.clear();
  };

  return {
    makeRequest,
    makeStreamRequest,
    clearCache,
  };
}