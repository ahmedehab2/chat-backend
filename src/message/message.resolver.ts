import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseFilters, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IAccessTokenPayload } from 'src/common/types/token-payload';
import { UsersService } from 'src/user/users.service';
import { GraphQLExceptionFilter } from 'src/common/exceptions/graphql.exceptions';

@UseGuards(GqlAuthGuard)
@UseFilters(GraphQLExceptionFilter)
@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UsersService,
  ) {}

  @Mutation(() => Message)
  createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    return this.messageService.create(createMessageInput, user._id);
  }

  @Query(() => [Message])
  findAll() {
    return this.messageService.findAll();
  }

  @Query(() => Message)
  findOne(@Args('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Query(() => [Message], { name: 'chatMessages' })
  async getChatMessages(
    @Args('roomId', {
      type: () => String,
    })
    roomId: string,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number,
    @Args('page', {
      type: () => Int,
      defaultValue: 1,
    })
    page: number,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    const skip = (page - 1) * limit;
    return this.messageService.findByRoomId(roomId, user._id, {
      limit,
      skip,
    });
  }
}
