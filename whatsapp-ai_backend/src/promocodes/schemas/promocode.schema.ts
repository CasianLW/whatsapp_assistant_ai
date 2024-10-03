import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PromoCode extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  discount: number; // Discount in credits

  @Prop({ default: 1 })
  maxUsage: number;

  @Prop({ default: 0 })
  timesUsed: number; // Track how many times it has been used

  @Prop({ default: Date.now })
  expiresAt: Date;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
