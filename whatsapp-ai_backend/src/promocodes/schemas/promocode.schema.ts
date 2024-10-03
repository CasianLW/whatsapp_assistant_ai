import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PromoCode extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  discount: number; // Discount percentage or credit bonus

  @Prop({ default: 1 }) // Maximum usage
  maxUsage: number;

  @Prop({ default: Date.now })
  expiresAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
