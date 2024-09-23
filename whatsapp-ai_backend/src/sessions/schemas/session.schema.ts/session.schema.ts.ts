import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema.ts/user.schema.ts';

@Schema()
export class Session extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  whatsappSessionId: string;

  @Prop({ default: 'disconnected' }) // connected, disconnected, etc.
  status: string;

  @Prop()
  lastActiveAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
