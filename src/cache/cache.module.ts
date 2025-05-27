import { Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';

export const CACHE_INSTANCE = 'CACHE_INSTANCE';

@Module({
  providers: [
    {
      provide: CACHE_INSTANCE,
      useFactory: async () => {
        const secondary = new KeyvRedis('redis://localhost:6379', {});
        await secondary.getClient();

        return new Cacheable({ secondary });
      },
    },
  ],
  exports: [CACHE_INSTANCE],
})
export class CacheModule {}
