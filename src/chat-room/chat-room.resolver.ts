import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, ForbiddenException, UseFilters } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoom } from './entities/chat-room.entity';
import { CreateChatRoomInput } from './dto/create-chat-room.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IAccessTokenPayload } from '../common/types/token-payload';
import { User } from '../user/entities/user.entity';
import { UsersService } from '../user/users.service';
import { GraphQLExceptionFilter } from 'src/common/exceptions/graphql.exceptions';

@Resolver(() => ChatRoom)
@UseGuards(GqlAuthGuard)
@UseFilters(GraphQLExceptionFilter)
export class ChatRoomResolver {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => ChatRoom)
  async createChatRoom(
    @Args('input') createChatRoomInput: CreateChatRoomInput,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    return await this.chatRoomService.create(createChatRoomInput, user._id);
  }

  @Query(() => [ChatRoom], { name: 'rooms' })
  async getChatRooms(@CurrentUser() user: IAccessTokenPayload) {
    return await this.chatRoomService.findUserRooms(user._id);
  }

  @Query(() => ChatRoom)
  async chatRoom(
    @Args('id') id: string,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    const room = await this.chatRoomService.findOne(id);
    if (!room.members.some((member) => member.toString() === user._id)) {
      throw new ForbiddenException('You are not a member of this room');
    }
    return room;
  }

  @Mutation(() => ChatRoom)
  async addMember(
    @Args('roomId') roomId: string,
    @Args('userId') userId: string,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    const room = await this.chatRoomService.findOne(roomId);
    if (!room.members.some((member) => member.toString() === user._id)) {
      throw new ForbiddenException('You are not a member of this room');
    }
    if (room.members.some((member) => member.toString() === userId)) {
      throw new ForbiddenException('User is already a member of this room');
    }
    return this.chatRoomService.addMember(roomId, userId);
  }

  @Mutation(() => ChatRoom)
  async removeMember(
    @Args('roomId') roomId: string,
    @Args('userId') userId: string,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    const room = await this.chatRoomService.findOne(roomId);
    if (!room.members.some((member) => member.toString() === user._id)) {
      throw new ForbiddenException('You are not a member of this room');
    }
    if (userId === user._id) {
      throw new ForbiddenException('Cannot remove yourself from the room');
    }
    return await this.chatRoomService.removeMember(roomId, userId);
  }

  @Mutation(() => Boolean)
  async deleteRoom(
    @Args('roomId') roomId: string,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    await this.chatRoomService.deleteRoom(roomId, user._id);
    return true;
  }

  @Mutation(() => ChatRoom)
  async leaveRoom(
    @Args('roomId') roomId: string,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    return await this.chatRoomService.leaveRoom(roomId, user._id);
  }

  @ResolveField('members', () => [User])
  async getMembers(
    @Parent() room: ChatRoom,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    const filteredMemberIds = room.members
      .map((member) => member.toString())
      .filter((memberId) => memberId !== user._id); // Remove the current user's ID
    return await this.usersService.findsByIds(filteredMemberIds);
  }

  @ResolveField('createdBy', () => User)
  async getCreatedBy(@Parent() room: ChatRoom) {
    return await this.usersService.findOne(room.createdBy.toString());
  }
}
