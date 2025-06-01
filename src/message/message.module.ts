import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { UsersModule } from 'src/user/users.module';
import { MessageRepository } from './message.repository';
import { Message, MessageSchema } from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  providers: [MessageResolver, MessageService, MessageRepository],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
    forwardRef(() => ChatRoomModule),
  ],
  exports: [MessageService],
})
export class MessageModule {}
