import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { UsersService } from 'src/user/users.service';
import { extractUserFromSocket } from 'src/auth/utils/ws-auth.util';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({ cors: true })
export class ChatRoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      client.user = extractUserFromSocket(client, this.jwtService);
      this.usersService.UpdateOnlineStatus(client.user?._id, true);
    } catch (err) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.usersService.UpdateOnlineStatus(client.user?._id, false);
  }

  @UseGuards(WsAuthGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('message')
  async handleMessage(client: Socket, message: MessageDto) {
    await this.messageService.create(
      {
        roomId: message.roomId,
        content: message.content,
      },
      client.user?._id,
    );
    client.broadcast.to(message.roomId).emit('message', message);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
  }
}
