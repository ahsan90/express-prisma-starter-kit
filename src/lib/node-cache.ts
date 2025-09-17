import NodeCache from "node-cache";

const cache = new NodeCache({
    stdTTL: 3600, // standard time to live in seconds, adjust as needed
    checkperiod: 120, // time in seconds to check for expired keys
    useClones: false, // set to false to improve performance if you don't need cloned values
});

export const asyncNodeCache = {
    /**
     * Get a value from cache
     * @param key - Cache key
     * @returns Promise resolving to cached value or undefined
     */
    async get<T = any>(key: string): Promise<T | undefined> {
        return new Promise((resolve) => {
            const value = cache.get<T>(key);
            resolve(value);
        });
    },

    /**
     * Set a value in cache
     * @param key - Cache key
     * @param value - Value to cache
     * @param ttl - Time to live in seconds (optional, uses default if not provided)
     * @returns Promise resolving to true if successful
     */
    async set<T = any>(key: string, value: T, ttl?: number): Promise<boolean> {
        return new Promise((resolve) => {
            const success = ttl !== undefined ? cache.set(key, value, ttl) : cache.set(key, value);
            resolve(success);
        });
    },

    /**
     * Delete a value from cache
     * @param key - Cache key to delete
     * @returns Promise resolving to true if key existed and was deleted
     */
    async delete(key: string): Promise<boolean> {
        return new Promise((resolve) => {
            const deleted = cache.del(key);
            resolve(deleted > 0);
        });
    },

    /**
     * Check if a key exists in cache
     * @param key - Cache key to check
     * @returns Promise resolving to true if key exists
     */
    async has(key: string): Promise<boolean> {
        return new Promise((resolve) => {
            const exists = cache.has(key);
            resolve(exists);
        });
    },

    /**
     * Get multiple values from cache
     * @param keys - Array of cache keys
     * @returns Promise resolving to object with key-value pairs
     */
    async mget<T = any>(keys: string[]): Promise<Record<string, T>> {
        return new Promise((resolve) => {
            const values = cache.mget<T>(keys);
            resolve(values);
        });
    },

    /**
     * Set multiple values in cache
     * @param keyValuePairs - Object with key-value pairs to cache
     * @param ttl - Time to live in seconds (optional)
     * @returns Promise resolving to true if all operations were successful
     */
    async mset<T = any>(keyValuePairs: Record<string, T>, ttl?: number): Promise<boolean> {
        return new Promise((resolve) => {
            const results = cache.mset(
                Object.entries(keyValuePairs).map(([key, value]) => ({
                    key,
                    val: value,
                    ttl
                }))
            );
            resolve(results);
        });
    },

    /**
     * Delete multiple values from cache
     * @param keys - Array of cache keys to delete
     * @returns Promise resolving to number of deleted keys
     */
    async mdelete(keys: string[]): Promise<number> {
        return new Promise((resolve) => {
            const deleted = cache.del(keys);
            resolve(deleted);
        });
    },

    /**
     * Get all cache keys
     * @returns Promise resolving to array of all cache keys
     */
    async keys(): Promise<string[]> {
        return new Promise((resolve) => {
            const allKeys = cache.keys();
            resolve(allKeys);
        });
    },

    /**
     * Flush all cached data
     * @returns Promise resolving to void
     */
    async flush(): Promise<void> {
        return new Promise((resolve) => {
            cache.flushAll();
            resolve();
        });
    },

    /**
     * Get cache statistics
     * @returns Promise resolving to cache stats object
     */
    async stats(): Promise<NodeCache.Stats> {
        return new Promise((resolve) => {
            const statistics = cache.getStats();
            resolve(statistics);
        });
    },

    /**
     * Get TTL (time to live) for a key
     * @param key - Cache key
     * @returns Promise resolving to TTL in seconds, or 0 if key doesn't exist
     */
    async getTtl(key: string): Promise<number> {
        return new Promise((resolve) => {
            const ttl = cache.getTtl(key);
            resolve(ttl || 0);
        });
    },

    /**
     * Set TTL for an existing key
     * @param key - Cache key
     * @param ttl - Time to live in seconds
     * @returns Promise resolving to true if successful
     */
    async setTtl(key: string, ttl: number): Promise<boolean> {
        return new Promise((resolve) => {
            const success = cache.ttl(key, ttl);
            resolve(success);
        });
    },

    /**
     * Get or set a value with a callback function
     * @param key - Cache key
     * @param callback - Function to generate value if not cached
     * @param ttl - Time to live in seconds (optional)
     * @returns Promise resolving to cached or newly generated value
     */
    async getOrSet<T>(
        key: string,
        callback: () => Promise<T> | T,
        ttl?: number
    ): Promise<T> {
        const cachedValue = await this.get<T>(key);
        if (cachedValue !== undefined) {
            return cachedValue;
        }

        const newValue = await callback();
        await this.set(key, newValue, ttl);
        return newValue;
    },

    /**
     * Clear expired keys manually
     * @returns Promise resolving to void
     */
    async cleanup(): Promise<void> {
        return new Promise((resolve) => {
            cache.flushStats();
            resolve();
        });
    },

    /**
     * Get cache size (number of keys)
     * @returns Promise resolving to number of keys in cache
     */
    async size(): Promise<number> {
        const keys = await this.keys();
        return keys.length;
    },

    /**
     * Check if cache is empty
     * @returns Promise resolving to true if cache is empty
     */
    async isEmpty(): Promise<boolean> {
        const size = await this.size();
        return size === 0;
    },

    /**
     * Get multiple values with default fallback
     * @param keys - Array of cache keys
     * @param defaultValue - Default value for missing keys
     * @returns Promise resolving to object with all keys and their values
     */
    async mgetWithDefaults<T>(
        keys: string[],
        defaultValue: T
    ): Promise<Record<string, T>> {
        const values = await this.mget<T>(keys);
        const result: Record<string, T> = {};

        for (const key of keys) {
            result[key] = values[key] !== undefined ? values[key] : defaultValue;
        }

        return result;
    },

    /**
     * Set a value only if key doesn't exist (set if not exists)
     * @param key - Cache key
     * @param value - Value to cache
     * @param ttl - Time to live in seconds (optional)
     * @returns Promise resolving to true if key was set, false if key already exists
     */
    async setIfNotExists<T>(key: string, value: T, ttl?: number): Promise<boolean> {
        const exists = await this.has(key);
        if (exists) {
            return false;
        }

        return await this.set(key, value, ttl);
    },

    /**
     * Increment a numeric value in cache
     * @param key - Cache key
     * @param increment - Amount to increment by (default: 1)
     * @returns Promise resolving to new value or false if key doesn't exist or isn't numeric
     */
    async increment(key: string, increment: number = 1): Promise<number | false> {
        const currentValue = await this.get<number>(key);
        if (currentValue === undefined || typeof currentValue !== 'number') {
            return false;
        }

        const newValue = currentValue + increment;
        const success = await this.set(key, newValue);
        return success ? newValue : false;
    },

    /**
     * Decrement a numeric value in cache
     * @param key - Cache key
     * @param decrement - Amount to decrement by (default: 1)
     * @returns Promise resolving to new value or false if key doesn't exist or isn't numeric
     */
    async decrement(key: string, decrement: number = 1): Promise<number | false> {
        const currentValue = await this.get<number>(key);
        if (currentValue === undefined || typeof currentValue !== 'number') {
            return false;
        }

        const newValue = currentValue - decrement;
        const success = await this.set(key, newValue);
        return success ? newValue : false;
    }
};
