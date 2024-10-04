import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';

import { UsersModule } from '../users/users.module';
import {
  WhatsAppSession,
  WhatsAppSessionSchema,
} from './schemas/whatsapp.schema';
import { BotConfig, BotConfigSchema } from 'src/bot/schemas/bot-config.schema';
import { BotModule } from 'src/bot/bot.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WhatsAppSession.name, schema: WhatsAppSessionSchema },
      { name: BotConfig.name, schema: BotConfigSchema },
    ]),
    UsersModule, // Import the UsersModule to handle user-related operations
    BotModule,
  ],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
