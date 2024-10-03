import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SpecialCodeDocument = SpecialCode & Document;

@Schema()
export class SpecialCode extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  credits: number; // Amount of credits to be added

  @Prop({ default: 1 })
  maxUsage: number;

  @Prop({ default: 0 })
  timesUsed: number;

  @Prop({ default: Date.now })
  expiresAt: Date;
}

export const SpecialCodeSchema = SchemaFactory.createForClass(SpecialCode);
