import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BotConfig extends Document {
  @Prop({ required: true })
  userId: string; // User ID linked to the bot config

  @Prop({ default: 'default' })
  context: string; // Bot context (e.g., "professional", "personal", "humor")

  @Prop({ default: 'default' })
  language: string; // Language preference (if any)

  @Prop({ default: [] })
  customResponses: string[]; // Array of custom responses for specific queries

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BotConfigSchema = SchemaFactory.createForClass(BotConfig);
