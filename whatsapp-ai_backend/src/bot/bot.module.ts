import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BotConfig, BotConfigSchema } from './schemas/bot-config.schema';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BotConfig.name, schema: BotConfigSchema },
    ]),
    OpenaiModule,
  ],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
