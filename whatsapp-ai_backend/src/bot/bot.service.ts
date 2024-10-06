import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BotConfig } from './schemas/bot-config.schema';
import { OpenAiService } from 'src/openai/openai.service';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    @InjectModel(BotConfig.name)
    private readonly botConfigModel: Model<BotConfig>,
    private readonly openAiService: OpenAiService, // Inject OpenAI Service
  ) {}

  async generateResponse(
    userId: string,
    message: string,
  ): Promise<string | null> {
    this.logger.debug(`Looking up bot configuration for user: ${userId}`);

    // Try to find the configuration in the database
    let userConfig = await this.botConfigModel.findOne({ userId }).exec();

    if (!userConfig) {
      this.logger.warn(
        `No bot configuration found for user: ${userId}. Using default configuration.`,
      );
      userConfig = await this.createDefaultConfig(userId);
    }

    this.logger.debug(`Bot configuration found: ${JSON.stringify(userConfig)}`);

    // Determine whether to use OpenAI or predefined responses
    if (userConfig.botType === 'openai' && userConfig.openAiConfig.apiKey) {
      // Initialize OpenAI if not already done
      this.openAiService.initializeOpenAi(userConfig.openAiConfig.apiKey);
      return await this.openAiService.generateChatResponse(message, userConfig);
    } else {
      return this.getPredefinedResponse(userConfig, message);
    }
  }

  private getPredefinedResponse(config: BotConfig, message: string): string {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('bonjour')) {
      return `Hello! I'm your ${config.context} bot. How can I assist you today?`;
    }
    if (lowerMessage.includes('bye') || lowerMessage.includes('au revoir')) {
      return `Goodbye! Have a great day!`;
    }
    return (
      config.customResponses.find((response) =>
        lowerMessage.includes(response),
      ) || `Sorry, I didn't understand that.`
    );
  }

  private async createDefaultConfig(userId: string): Promise<BotConfig> {
    const defaultConfig = new this.botConfigModel({
      userId: userId,
      context: 'assistant',
      botType: 'openai',
      openAiConfig: {
        apiKey: process.env.OPENAI_API_KEY || 'your-default-openai-api-key',
        model: 'gpt-3.5-turbo',
      },
    });
    await defaultConfig.save();
    this.logger.log(`Default bot configuration created for user: ${userId}`);
    return defaultConfig;
  }
}
