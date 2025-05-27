import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose from 'mongoose';

import { AbstractEntity } from 'src/common/abstract.entity';
import { collections } from 'src/common/collection-names';

@ObjectType()
@Schema({
  collection: collections.MESSAGE,
})
export class Message extends AbstractEntity {
  @Field()
  @Prop({ required: true })
  content: string;

  @Field()
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: collections.USER,
    required: true,
  })
  userId: string;

  @Field()
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: collections.CHAT_ROOM,
    required: true,
  })
  roomId: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
