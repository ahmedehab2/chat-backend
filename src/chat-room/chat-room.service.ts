import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ChatRoomRepository } from './chat-room.repository';
import { CreateChatRoomInput } from './dto/create-chat-room.input';
import mongoose from 'mongoose';

@Injectable()
export class ChatRoomService {
  constructor(private readonly chatRoomRepository: ChatRoomRepository) {}

  async create(createChatRoomInput: CreateChatRoomInput, userId: string) {
    if (!createChatRoomInput.isGroup) {
      const existingRoom = await this.findRoomByMembers([
        userId,
        createChatRoomInput.members[0],
      ]);
      if (existingRoom) {
        return existingRoom;
      }
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const memberIds = createChatRoomInput.members.map(
      (member) => new mongoose.Types.ObjectId(member),
    );

    const chatRoom = await this.chatRoomRepository.create({
      createdBy: userObjectId,
      members: [userObjectId, ...memberIds],
      name: createChatRoomInput.name,
      description: createChatRoomInput.description,
      isGroup: createChatRoomInput.isGroup,
    });

    return chatRoom;
  }

  async findAll() {
    return await this.chatRoomRepository.findAll({});
  }

  async findOne(id: string) {
    const chatRoom = await this.chatRoomRepository.findOne({ _id: id });
    if (!chatRoom) {
      throw new NotFoundException(`Chat room with ID ${id} not found`);
    }
    return chatRoom;
  }

  async findRoomByMembers(memberIds: string[]) {
    const objectIds = memberIds.map((id) => new mongoose.Types.ObjectId(id));
    return await this.chatRoomRepository.findOne({
      members: {
        $all: objectIds,
        $size: objectIds.length,
      },
      isGroup: false,
    });
  }

  async addMember(roomId: string, userId: string) {
    const room = await this.findOne(roomId);
    if (!room.isGroup) {
      throw new ConflictException('Cannot add members to direct messages');
    }

    return await this.chatRoomRepository.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { members: new mongoose.Types.ObjectId(userId) } },
    );
  }

  async removeMember(roomId: string, userId: string) {
    const room = await this.findOne(roomId);
    if (!room.isGroup) {
      throw new ConflictException('Cannot remove members from direct messages');
    }

    return await this.chatRoomRepository.findOneAndUpdate(
      { _id: roomId },
      { $pull: { members: new mongoose.Types.ObjectId(userId) } },
    );
  }

  async findUserRooms(userId: string) {
    return await this.chatRoomRepository.findAll({
      members: { $in: [new mongoose.Types.ObjectId(userId)] },
    });
  }

  async deleteRoom(roomId: string, userId: string) {
    const room = await this.findOne(roomId);
    if (room.createdBy.toString() !== userId) {
      throw new ConflictException('Only the creator can delete the room');
    }
    return await this.chatRoomRepository.findOneAndDelete({ _id: roomId });
  }

  async leaveRoom(roomId: string, userId: string) {
    const room = await this.findOne(roomId);
    if (room.createdBy.toString() === userId) {
      throw new ConflictException(
        'Creator cannot leave the room. Delete the room instead.',
      );
    }

    const updatedRoom = await this.chatRoomRepository.findOneAndUpdate(
      { _id: roomId },
      { $pull: { members: new mongoose.Types.ObjectId(userId) } },
      { new: true },
    );

    if (updatedRoom.members.length === 0) {
      await this.chatRoomRepository.findOneAndDelete({ _id: roomId });
      return null;
    }
    return updatedRoom;
  }
}
