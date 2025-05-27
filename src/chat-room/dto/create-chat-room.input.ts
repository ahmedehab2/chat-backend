import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsMongoId,
  ValidateIf,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

@InputType()
export class CreateChatRoomInput {
  @Field({ nullable: true })
  @ValidateIf((o) => o.isGroup)
  @IsNotEmpty({ message: 'Group chats must have a name.' })
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Boolean)
  @IsBoolean()
  isGroup: boolean;

  @Field(() => [String])
  @IsArray()
  @IsMongoId({ each: true, message: 'Each memberId must be a valid Mongo ID' })
  @ValidateIf((o) => o.isGroup === false)
  @ArrayMinSize(1, {
    message: 'Non-group chats must have exactly one memberId.',
  })
  @ArrayMaxSize(1, {
    message: 'Non-group chats must have exactly one memberId.',
  })
  members: string[];
}
