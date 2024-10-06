import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai'; // Corrected import statement
import { BotConfig } from 'src/bot/schemas/bot-config.schema';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private openAiClient: OpenAI | null = null;

  constructor() {}

  /**
   * Initialize OpenAI with the provided API key.
   */
  initializeOpenAi(apiKey: string): void {
    if (!apiKey) {
      this.logger.error('OpenAI API key is missing. Initialization failed.');
      return;
    }
    this.openAiClient = new OpenAI({ apiKey });
    this.logger.log('OpenAI client initialized successfully.');
  }

  /**
   * Generate a response using OpenAI based on the given prompt and configuration.
   */
  async generateResponse(
    prompt: string,
    config: BotConfig,
  ): Promise<string | null> {
    if (!this.openAiClient) {
      this.logger.error('OpenAI client is not initialized.');
      return null;
    }

    try {
      // Create the request based on the OpenAI completion structure
      const response = await this.openAiClient.completions.create({
        model: config.openAiConfig.model || 'text-davinci-003',
        prompt: prompt,
        max_tokens: 100,
        temperature: 0.7,
      });

      return response.choices[0]?.text?.trim() || null;
    } catch (error) {
      this.logger.error('Failed to generate response from OpenAI', error);
      return null;
    }
  }

  /**
   * Generate a chat-based response using OpenAI based on the given prompt and configuration.
   */
  async generateChatResponse(
    prompt: string,
    config: BotConfig,
  ): Promise<string | null> {
    if (!this.openAiClient) {
      this.logger.error('OpenAI client is not initialized.');
      return null;
    }

    try {
      const response = await this.openAiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
      });

      return response.choices[0]?.message?.content?.trim() || null;
    } catch (error) {
      this.logger.error('Failed to generate chat response from OpenAI', error);
      return null;
    }
  }
}
