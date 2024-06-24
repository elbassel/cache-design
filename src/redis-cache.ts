import { ICache } from './icache';
import Redis from 'ioredis';

export class RedisCache implements ICache {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379
    });

    this.client.on('error', (err) => {
      console.error('Redis client not connected to the server:', err);
    });

    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return this.client.get(key) as T | null;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  close(): void {
    this.client.quit();
  }
}