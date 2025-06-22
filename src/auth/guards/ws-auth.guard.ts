import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { extractUserFromSocket } from '../utils/ws-auth.util';
import { errMessages } from 'src/common/errors/err-msgs';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let client: Socket;

    try {
      client = context.switchToWs().getClient();
      extractUserFromSocket(client, this.jwtService);

      return true;
    } catch (err) {
      client.disconnect();
      throw new WsException(errMessages.UNAUTHORIZED);
    }
  }
}
