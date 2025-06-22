import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { errMessages } from 'src/common/errors/err-msgs';

export function extractUserFromSocket(
  client: Socket,
  jwtService: JwtService,
  tokenKey = 'accessToken',
) {
  const cookie = client.handshake.headers.cookie;
  const token =
    cookie
      ?.split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${tokenKey}=`))
      ?.split('=')[1] || null;

  try {
    const payload = jwtService.verify(token);
    return payload;
  } catch (error) {
    throw new Error(errMessages.INVALID_TOKEN);
  }
}
