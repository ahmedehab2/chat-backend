import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { Env } from 'src/common/config/env';

export const CACHE_INSTANCE = 'CACHE_INSTANCE';

@Module({
  providers: [
    {
      provide: CACHE_INSTANCE,
      useFactory: async () => {
        const secondary = new KeyvRedis(Env.redis.url, {});
        await secondary.getClient();

        return new Cacheable({ secondary });
      },
    },
  ],
  exports: [CACHE_INSTANCE],
})
export class CacheModule {}
