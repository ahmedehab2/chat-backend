import { AbstractRepository } from 'src/common/abstract.repository';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageRepository extends AbstractRepository<Message> {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {
    super(messageModel);
  }
}
