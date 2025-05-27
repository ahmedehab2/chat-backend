import { AbstractRepository } from 'src/common/abstract.repository';

import { ChatRoom } from './entities/chat-room.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatRoomRepository extends AbstractRepository<ChatRoom> {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
  ) {
    super(chatRoomModel);
  }
}
