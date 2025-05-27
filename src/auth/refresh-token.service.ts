import { Injectable } from '@nestjs/common';

import { Env } from 'src/common/config/env';
import { createHash, timingSafeEqual } from 'crypto';

import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly cache: CacheService) {}

  async save(refreshToken: string, userId: string) {
    const hashedToken = this.hashRefreshToken(refreshToken);

    await this.cache.set(userId, hashedToken, Env.jwt.refreshExpiration * 1000);
  }

  async validate(refreshToken: string, userId: string): Promise<boolean> {
    const storedHash = (await this.cache.get(userId)) as unknown as string;

    if (!storedHash) {
      return false;
    }

    const currentHash = this.hashRefreshToken(refreshToken);
    return timingSafeEqual(Buffer.from(storedHash), Buffer.from(currentHash));
  }

  async delete(userId: string) {
    await this.cache.delete(userId);
  }

  private hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
