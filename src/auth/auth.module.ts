import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local-strategy';
import { UsersModule } from 'src/user/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { Env } from 'src/common/config/env';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy';
import { RefreshTokenService } from './refresh-token.service';
import { CacheModule } from 'src/cache/cache.module';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    UsersModule,
    CacheModule,
    JwtModule.register({
      global: true,
      secret: Env.jwt.secret,
      signOptions: { expiresIn: Env.jwt.accessExpiration },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    RefreshTokenService,
    CacheService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
