import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class WhatsAppSession extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  sessionId: string; // Unique session ID for the WhatsApp instance

  @Prop({ default: false })
  isActive: boolean; // Whether the bot is currently active

  @Prop({ type: [String], default: [] })
  statusTriggers: string[]; // WhatsApp statuses to activate the bot

  @Prop({ default: 'default' })
  loadout: string; // Loadout name or configuration

  @Prop({ default: '' })
  context: string; // Customized AI context for the bot

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const WhatsAppSessionSchema =
  SchemaFactory.createForClass(WhatsAppSession);
