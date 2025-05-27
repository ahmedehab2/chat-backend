import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field()
  @IsString()
  content: string;

  @Field()
  @IsString()
  roomId: string;
}
