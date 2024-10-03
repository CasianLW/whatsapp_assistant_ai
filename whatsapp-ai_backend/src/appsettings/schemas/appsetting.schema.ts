import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class AppSetting extends Document {
  @Prop({ required: true })
  aiKey: string;

  @Prop({ required: true })
  value: string; // JSON string or any configuration value

  @Prop()
  description: string; // Optional description

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AppSettingSchema = SchemaFactory.createForClass(AppSetting);
