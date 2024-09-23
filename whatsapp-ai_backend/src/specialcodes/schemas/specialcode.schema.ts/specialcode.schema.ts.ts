import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema.ts/user.schema.ts';

@Schema()
export class SpecialCode extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  credits: number; // Number of credits granted by the code

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId; // User who redeemed the code

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SpecialCodeSchema = SchemaFactory.createForClass(SpecialCode);
