import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { IAccessTokenPayload } from 'src/common/types/token-payload';
import { Env } from 'src/common/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: Env.jwt.secret,
    });
  }

  async validate(payload: IAccessTokenPayload) {
    return payload;
  }
}
