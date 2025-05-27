import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type MessagePayload = {
  chatId: string;
  content: string;
  userId: string;
};

@WebSocketGateway({ cors: true })
export class ChatRoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly jwtService: JwtService) {}
  @WebSocketServer()
  server: Server;

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

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: MessagePayload) {
    console.log(message);
    client.broadcast.to(message.chatId).emit('message', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    console.log(`Client ${client.id} joined room ${room}`);
  }
}
