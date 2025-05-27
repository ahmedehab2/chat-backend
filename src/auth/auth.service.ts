import {
  UnauthorizedException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { IAccessTokenPayload } from 'src/common/types/token-payload';
import { UsersService } from 'src/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Env } from 'src/common/config/env';
import { CreateUserDTO } from 'src/user/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(createUserDTO: CreateUserDTO) {
    await this.userService.create(createUserDTO);
  }

  generateTokens(user: User) {
    const payload: IAccessTokenPayload = {
      email: user.email,
      _id: user._id.toHexString(),
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { _id: user._id.toHexString() },
      { expiresIn: Env.jwt.refreshExpiration },
    );
    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, oldRefreshToken: string) {
    const isValid = await this.refreshTokenService.validate(
      oldRefreshToken,
      userId,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const tokens = this.generateTokens(user);
    await this.refreshTokenService.delete(userId);
    await this.refreshTokenService.save(tokens.refreshToken, userId);
    return tokens;
  }

  async logout(userId: string) {
    await this.refreshTokenService.delete(userId);
  }
}
