import { useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  duration?: number; // Cache duration in milliseconds
  namespace?: string; // Optional namespace for the cache
}

const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class Cache {
  private static caches: Record<string, Record<string, CacheEntry<any>>> = {};

  static set<T>(key: string, data: T, options: CacheOptions = {}) {
    const { duration = DEFAULT_CACHE_DURATION, namespace = 'default' } = options;
    
    // Initialize namespace if it doesn't exist
    if (!this.caches[namespace]) {
      this.caches[namespace] = {};
    }

    this.caches[namespace][key] = {
      data,
      timestamp: Date.now() + duration
    };
  }

  static get<T>(key: string, options: CacheOptions = {}): T | null {
    const { namespace = 'default' } = options;
    const now = Date.now();
    
    const cache = this.caches[namespace]?.[key];
    if (!cache) return null;

    // Check if cache has expired
    if (now > cache.timestamp) {
      this.remove(key, { namespace });
      return null;
    }

    return cache.data;
  }

  static remove(key: string, options: CacheOptions = {}) {
    const { namespace = 'default' } = options;
    if (this.caches[namespace]) {
      delete this.caches[namespace][key];
    }
  }

  static clear(namespace?: string) {
    if (namespace) {
      delete this.caches[namespace];
    } else {
      this.caches = {};
    }
  }

  static has(key: string, options: CacheOptions = {}): boolean {
    const { namespace = 'default' } = options;
    return !!this.get(key, { namespace });
  }
}

export function useCache() {
  const set = useCallback(<T>(key: string, data: T, options?: CacheOptions) => {
    Cache.set(key, data, options);
  }, []);

  const get = useCallback(<T>(key: string, options?: CacheOptions): T | null => {
    return Cache.get<T>(key, options);
  }, []);

  const remove = useCallback((key: string, options?: CacheOptions) => {
    Cache.remove(key, options);
  }, []);

  const clear = useCallback((namespace?: string) => {
    Cache.clear(namespace);
  }, []);

  const has = useCallback((key: string, options?: CacheOptions): boolean => {
    return Cache.has(key, options);
  }, []);

  return {
    set,
    get,
    remove,
    clear,
    has
  };
}