import { Injectable, NotFoundException } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { MessageRepository } from './message.repository';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatRoomService: ChatRoomService,
  ) {}

  async create(
    createMessageInput: CreateMessageInput,
    userId: string,
  ): Promise<Message> {
    const createdMessage = await this.messageRepository.create({
      ...createMessageInput,
      userId,
    });
    return createdMessage;
  }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.findAll();
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      _id: id,
    });
    if (!message) {
      throw new NotFoundException(`Message #${id} not found`);
    }
    return message;
  }

  async findByRoomId(
    roomId: string,
    userId: string,
    options?: {
      limit?: number;
      skip?: number;
      sort?: {
        [key: string]: 1 | -1;
      };
    },
  ): Promise<Message[]> {
    const room = await this.chatRoomService.findOne(roomId);
    if (!room.members.some((member) => member.toString() === userId)) {
      throw new ForbiddenException('You are not a member of this room');
    }
    return await this.messageRepository.findAll({ roomId }, {}, undefined, {
      queryOptions: {
        limit: options?.limit,
        skip: options?.skip,
        sort: options?.sort || {
          createdAt: -1,
        },
      },
    });
  }
}
