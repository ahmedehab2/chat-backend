import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@ObjectType()
export abstract class AbstractEntity extends Document {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Prop()
  @Field()
  createdAt: Date;

  @Prop()
  @Field()
  updatedAt: Date;
}
