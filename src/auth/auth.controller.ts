import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Env } from 'src/common/config/env';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from 'src/common/types/token-payload';
import { JwtRefreshGuard } from './guards/refresh-token.guard';
import { RefreshTokenService } from './refresh-token.service';
import { CreateUserDTO } from 'src/user/dto/create-user.input';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: Env.environment === 'production',
        expires: new Date(Date.now() + Env.jwt.refreshExpiration * 1000),
      })
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: Env.environment === 'production',
        expires: new Date(Date.now() + Env.jwt.accessExpiration * 1000),
      });
  }

  @Post('register')
  async register(@Body() createUserDTO: CreateUserDTO) {
    this.logger.debug(`Register attempt for user: ${createUserDTO.email}`);
    await this.authService.register(createUserDTO);
    return {
      message: 'Registration successful',
    };
  }

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.debug(`Login attempt for user: ${user.email}`);
    const { accessToken, refreshToken } = this.authService.generateTokens(user);

    await this.refreshTokenService.save(refreshToken, user._id.toHexString());
    this.setAuthCookies(res, accessToken, refreshToken);
    return {
      message: 'Login successful',
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @CurrentUser() user: IRefreshTokenPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    this.logger.debug(`Refreshing tokens for user: ${user._id}`);
    const tokens = await this.authService.refreshTokens(user._id, refreshToken);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      message: 'Tokens refreshed successfully',
    };
  }

  @UseGuards(GqlAuthGuard)
  @Post('logout')
  logout(
    @CurrentUser() user: IAccessTokenPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.debug(`Logout attempt for user: ${user.email}`);
    res.clearCookie('refreshToken').clearCookie('accessToken');
    this.refreshTokenService.delete(user._id);
    return {
      message: 'Logout successful',
    };
  }
}
