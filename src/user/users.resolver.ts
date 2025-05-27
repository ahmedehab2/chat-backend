import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
// import { UpdateUserInput } from './dto/update-user.input';
import { NotFoundException, UseFilters, UseGuards } from '@nestjs/common';
import { GraphQLExceptionFilter } from 'src/common/exceptions/graphql.exceptions';
import { errMessages } from 'src/common/errors/err-msgs';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { IAccessTokenPayload } from 'src/common/types/token-payload';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Resolver(() => User)
@UseFilters(GraphQLExceptionFilter)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // @Mutation(() => User)
  // async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return await this.usersService.create(createUserInput);
  // }
  @Query(() => [User], { name: 'users' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(errMessages.USER_NOT_FOUND);
    }
    return user;
  }

  // @Mutation(() => User)
  // async updateUser(
  //   @Args('id') id: string,
  //   @Args('updateUserInput') updateUserInput: UpdateUserInput,
  // ) {
  //   const user = await this.usersService.update(id, updateUserInput);
  //   if (!user) {
  //     throw new NotFoundException(errMessages.USER_NOT_FOUND);
  //   }
  //   return user;
  // }

  @Mutation(() => User)
  async deleteUser(@Args('id') id: string) {
    const user = await this.usersService.delete(id);
    if (!user) {
      throw new NotFoundException(errMessages.USER_NOT_FOUND);
    }
    return user;
  }

  @Query(() => User, { name: 'me' })
  async getMe(@CurrentUser() user: IAccessTokenPayload) {
    return await this.usersService.findOne(user._id);
  }

  @Query(() => [User], { name: 'searchUsers' })
  async findUsers(
    @Args('name', { type: () => String, nullable: false }) name: string,
    @CurrentUser() user: IAccessTokenPayload,
  ) {
    return await this.usersService.search(name, user._id);
  }
}
