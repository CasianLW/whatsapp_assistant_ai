import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BotConfig } from './bot-config.schema';

@Schema()
export class UserBotConfig extends Document {
  @Prop({ required: true, unique: true })
  userId: string; // User ID linked to the configuration

  @Prop({ type: [Types.ObjectId], ref: 'BotConfig' })
  loadouts: BotConfig[]; // All the loadouts available for this user

  @Prop({ type: Types.ObjectId, ref: 'BotConfig' })
  activeLoadout: BotConfig; // The currently active loadout for responses

  @Prop({ default: false })
  botEnabled: boolean; // General on/off switch for automatic responses

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserBotConfigSchema = SchemaFactory.createForClass(UserBotConfig);
