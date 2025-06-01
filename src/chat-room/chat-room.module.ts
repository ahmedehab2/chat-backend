import { forwardRef, Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomGateway } from './chat-room.gateway';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoom, ChatRoomSchema } from './entities/chat-room.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/user/users.module';
import { ChatRoomResolver } from './chat-room.resolver';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    UsersModule,
    forwardRef(() => MessageModule),
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
