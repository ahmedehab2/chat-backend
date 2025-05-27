import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomGateway } from './chat-room.gateway';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoom, ChatRoomSchema } from './entities/chat-room.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/user/users.module';
import { ChatRoomResolver } from './chat-room.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    UsersModule,
  ],
  providers: [
    ChatRoomGateway,
    ChatRoomService,
    ChatRoomRepository,
    ChatRoomResolver,
  ],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
