import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { errMessages } from 'src/common/errors/err-msgs';

type MessagePayload = {
  roomId: string;
  content: string;
  userId: string;
};

@WebSocketGateway({ cors: true })
export class ChatRoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
  ) {}

  getTokenFromCookie(cookie: string, key: string) {
    return (
      cookie
        ?.split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${key}=`))
        ?.split('=')[1] || null
    );
  }
  async handleConnection(client: Socket) {
    const cookie = client.handshake.headers.cookie;
    const token = this.getTokenFromCookie(cookie, 'accessToken');
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      this.jwtService.verify(token);
    } catch (e) {
      client.disconnect();
      return;
    }
  }

  async handleDisconnect(client: Socket) {}

  @SubscribeMessage('message')
  async handleMessage(client: Socket, message: MessagePayload) {
    if (!message.roomId || !message.content || !message.userId) {
      client.emit('error', {
        error: errMessages.INVALID_MESSAGE_FORMAT,
      });
      return;
    }

    await this.messageService.create(
      {
        roomId: message.roomId,
        content: message.content,
      },
      message.userId,
    );
    client.broadcast.to(message.roomId).emit('message', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
  }
}
}
