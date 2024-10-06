import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BotContext = 'professional' | 'personal' | 'humor' | 'assistant';
export type BotType = 'openai' | 'predefined';

@Schema()
export class BotConfig extends Document {
  @Prop({ required: true })
  userId: string; // User ID linked to the bot config

  @Prop({ type: String, default: 'humor' })
  context: BotContext; // Bot context (e.g., "professional", "personal", "humor", "assistant")

  @Prop({ type: String, default: 'openai' })
  botType: BotType; // Bot type ("openai" for AI-generated or "predefined" for static responses)

  @Prop({ type: String, default: 'Francais' })
  language: string; // Language preference (if any)

  @Prop({ type: [String], default: [] })
  customResponses: string[]; // Array of custom responses for specific queries

  @Prop({ type: Object, default: {} })
  openAiConfig: { apiKey: string; model: string }; // Configuration specific to OpenAI (apiKey, model)

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BotConfigSchema = SchemaFactory.createForClass(BotConfig);
