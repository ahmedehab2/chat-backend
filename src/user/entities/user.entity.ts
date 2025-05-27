import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from 'src/common/abstract.entity';
import { collections } from 'src/common/collection-names';

@Schema({ collection: collections.USER, timestamps: true, versionKey: false })
@ObjectType()
export class User extends AbstractEntity {
  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  @Field()
  isOnline: boolean;

  @Prop({ default: null })
  @Field({
    nullable: true,
  })
  avatar: string;

  @Prop({ default: '' })
  @Field({
    nullable: true,
  })
  bio: string;

  @Prop({ default: null })
  @Field({ nullable: true })
  lastSeen: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
