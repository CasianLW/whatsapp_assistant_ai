import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenAiService } from './openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BotConfig, BotConfigSchema } from 'src/bot/schemas/bot-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BotConfig.name, schema: BotConfigSchema },
    ]),
  ],
  controllers: [OpenaiController],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenaiModule {}
