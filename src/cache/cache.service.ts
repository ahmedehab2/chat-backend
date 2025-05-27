import { Inject, Injectable } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CACHE_INSTANCE } from './cache.module';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_INSTANCE) private readonly cache: Cacheable) {}

  async get(key: string) {
    return await this.cache.get(key);
  }

  async set(key: string, value: any, ttl?: number | string): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
  }
}
