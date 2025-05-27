import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Env } from './common/config/env';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { UsersModule } from './user/users.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { ChatRoomModule } from './chat-room/chat-room.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MessageModule } from './message/message.module';
import { TransformInterceptor } from './common/interceptors/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(Env.db.connectionString),

    CacheModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: Env.environment === 'development',
      formatError: (err) => {
        return {
          message: err.message,
          extensions: {
            code: err.extensions?.code || err.extensions?.exception?.code,
          },
        };
      },
    }),
    UsersModule,
    AuthModule,
    ChatRoomModule,
    MessageModule,
    FirebaseModule.forRoot({
      privateKey: Env.firebase.privateKey,
      clientEmail: Env.firebase.clientEmail,
      projectId: Env.firebase.projectId,
      storageBucket: Env.firebase.storageBucket,
    }),
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransformInterceptor,
    // },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware).forRoutes('*');
  // }
}
