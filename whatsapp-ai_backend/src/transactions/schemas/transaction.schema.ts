import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string; // User ID who made the transaction

  @Prop({ required: true })
  receiptId: string; // Stripe receipt ID
  @Prop({ required: true })
  paymentIntent: string; // Stripe receipt ID
  @Prop({ required: true })
  customerEmail: string; // Stripe receipt ID

  @Prop({ required: true })
  amount: number; // Amount paid (in cents)

  @Prop({ required: true })
  credits: number; // Credits purchased

  @Prop({ default: 'completed' }) // Status of the transaction
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
