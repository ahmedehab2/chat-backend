import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { AbstractEntity } from 'src/common/abstract.entity';
import { collections } from 'src/common/collection-names';
import { User } from 'src/user/entities/user.entity';

@Schema({
  collection: collections.CHAT_ROOM,
})
@ObjectType()
export class ChatRoom extends AbstractEntity {
  @Field()
  @Prop({})
  name: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field()
  @Prop({ default: false })
  isGroup: boolean;

  @Field()
  @Prop({ default: false })
  isPrivate: boolean;

  @Field(() => [User])
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: collections.USER }],
  })
  members: User[] | Types.ObjectId[];

  @Field(() => User)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: collections.USER })
  createdBy: User | Types.ObjectId;

  @Field()
  @Prop({
    default: '',
  })
  lastMessage: string;

  @Field()
  @Prop({
    default: new Date(),
  })
  lastUpdate: Date;

  @Field({ nullable: true })
  @Prop({ default: null })
  avatar: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
