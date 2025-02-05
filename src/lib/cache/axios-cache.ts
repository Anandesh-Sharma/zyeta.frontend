import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface CacheEntry {
  data: any;
  timestamp: number;
  etag?: string;
}

interface CacheConfig extends AxiosRequestConfig {
  cacheDuration?: number; // Duration in milliseconds
  forceRefresh?: boolean;
}

class AxiosCache {
  private static cache: Map<string, CacheEntry> = new Map();
  private static defaultDuration = 5 * 60 * 1000; // 5 minutes

  private static generateCacheKey(config: CacheConfig): string {
    const { method = 'get', url = '', params, data } = config;
    return JSON.stringify({
      method: method.toLowerCase(),
      url,
      params,
      data,
    });
  }

  private static isExpired(timestamp: number, duration: number): boolean {
    return Date.now() > timestamp + duration;
  }

  static async request<T = any>(config: CacheConfig): Promise<AxiosResponse<T>> {
    const {
      cacheDuration = this.defaultDuration,
      forceRefresh = false,
      ...axiosConfig
    } = config;

    // Only cache GET requests by default
    if (axiosConfig.method?.toLowerCase() !== 'get') {
      return axios(axiosConfig);
    }

    const cacheKey = this.generateCacheKey(axiosConfig);
    const cachedEntry = this.cache.get(cacheKey);

    // Return cached data if:
    // 1. We have a cache hit
    // 2. The cache hasn't expired
    // 3. We're not forcing a refresh
    if (
      cachedEntry &&
      !this.isExpired(cachedEntry.timestamp, cacheDuration) &&
      !forceRefresh
    ) {
      return Promise.resolve({
        ...axiosConfig,
        status: 200,
        statusText: 'OK',
        headers: {},
        data: cachedEntry.data,
        cached: true,
      });
    }

    try {
      // Make the actual request
      const response = await axios({
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'If-None-Match': cachedEntry?.etag,
        },
      });

      // Cache the new response
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
        etag: response.headers.etag,
      });

      return response;
    } catch (error) {
      // Handle 304 Not Modified
      if (axios.isAxiosError(error) && error.response?.status === 304 && cachedEntry) {
        return Promise.resolve({
          ...axiosConfig,
          status: 200,
          statusText: 'OK',
          headers: {},
          data: cachedEntry.data,
          cached: true,
        });
      }
      throw error;
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }

  static removeCacheEntry(config: AxiosRequestConfig): void {
    const cacheKey = this.generateCacheKey(config);
    this.cache.delete(cacheKey);
  }

  static getCacheSize(): number {
    return this.cache.size;
  }

  static setDefaultDuration(duration: number): void {
    this.defaultDuration = duration;
  }
}

export default AxiosCache;