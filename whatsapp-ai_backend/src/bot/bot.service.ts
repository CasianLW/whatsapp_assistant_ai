import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BotConfig } from './schemas/bot-config.schema';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  constructor(
    @InjectModel(BotConfig.name)
    private readonly botConfigModel: Model<BotConfig>,
  ) {}

  /**
   * Generates a response for the bot based on the user configuration.
   */
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

      // Create a default configuration if none is found
      userConfig = await this.createDefaultConfig(userId);

      if (!userConfig) {
        this.logger.error(
          `Failed to create a default bot configuration for user: ${userId}`,
        );
        return null;
      }
    }

    this.logger.debug(`Bot configuration found: ${JSON.stringify(userConfig)}`);
    return this.getBotResponse(userConfig, message);
  }

  /**
   * Generates a bot response based on the configuration and message content.
   */
  private getBotResponse(config: BotConfig, message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('bonjour')) {
      return `Hello! I'm your ${config.context} bot. How can I assist you today?`;
    }
    if (lowerMessage.includes('bye') || lowerMessage.includes('au revoir')) {
      return `Goodbye! Have a great day!`;
    }
    return `Sorry, I didn't understand that.`;
  }

  /**
   * Creates a default bot configuration for the user.
   */
  private async createDefaultConfig(userId: string): Promise<BotConfig> {
    try {
      const defaultConfig = new this.botConfigModel({
        userId: userId,
        context: 'default',
      });

      await defaultConfig.save();
      this.logger.log(`Default bot configuration created for user: ${userId}`);
      return defaultConfig;
    } catch (error) {
      this.logger.error(
        `Error creating default configuration for user: ${userId}`,
        error,
      );
      return null;
    }
  }
}
