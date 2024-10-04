import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import makeWASocket, {
  AnyMessageContent,
  AuthenticationState,
  makeInMemoryStore,
  SignalDataTypeMap,
  useMultiFileAuthState,
  WASocket,
  DisconnectReason as BaileyDisconnectReason, // Correct import for DisconnectReason
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal';
import * as NodeCache from 'node-cache';
import * as fs from 'fs-extra';
import { WhatsAppSession } from './schemas/whatsapp.schema';
import { BotService } from 'src/bot/bot.service';
import { ConnectionState } from '@whiskeysockets/baileys/lib/Types';

@Injectable()
export class WhatsAppService {
  private qrCache = new NodeCache({ stdTTL: 300 }); // In-memory cache for QR codes with a TTL of 300 seconds
  private socket: WASocket | null = null;

  constructor(
    @InjectModel(WhatsAppSession.name)
    private readonly sessionModel: Model<WhatsAppSession>,
    private readonly botService: BotService,
  ) {}

  // Create a new WhatsApp session and save the QR code in the cache
  async createSession(userId: string): Promise<WhatsAppSession> {
    const userIdString = String(userId);

    // Clear any previous session data to prevent conflicts
    await this.cleanupPreviousSession(userIdString);

    // Initialize the store and multi-file authentication state
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    // Initialize a fresh in-memory store
    const store = makeInMemoryStore({});

    // Create the WhatsApp socket with the generated credentials
    this.socket = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    store.bind(this.socket.ev);

    this.socket.ev.on('messages.upsert', async (messageUpdate) => {
      const messages = messageUpdate.messages;
      for (const msg of messages) {
        if (!msg.key.fromMe && msg.message?.conversation) {
          console.log(`Received message: ${msg.message.conversation}`);
          const userStatus = await this.getUserStatus(userIdString);
          if (userStatus === 'occupy') {
            const response = await this.botService.generateResponse(
              userIdString,
              msg.message.conversation,
            );
            if (response) {
              console.log(`Responding with: ${response}`);
              await this.sendMessage(msg.key.remoteJid!, response);
            }
          }
        }
      }
    });

    return new Promise<WhatsAppSession>((resolve, reject) => {
      this.socket!.ev.on(
        'connection.update',
        async (update: Partial<ConnectionState>) => {
          const { connection, lastDisconnect, qr } = update;

          if (connection === 'close') {
            const statusCode = (lastDisconnect?.error as Boom)?.output
              ?.statusCode;
            const shouldReconnect =
              statusCode !== BaileyDisconnectReason.loggedOut;

            if (!shouldReconnect) {
              await this.cleanupPreviousSession(userIdString);
              await fs.remove('./auth_info');
              reject(
                new Error(
                  `WhatsApp session was logged out. Status Code: ${statusCode}`,
                ),
              );
            } else {
              await this.createSession(userIdString);
            }
          } else if (connection === 'open') {
            console.log('WhatsApp connection opened successfully!');
            if (!this.socket!.user) {
              console.error(
                'Failed to initialize WhatsApp session. `user` is undefined.',
              );
              return reject(
                new Error(
                  'Failed to initialize WhatsApp session. `user` is undefined.',
                ),
              );
            }

            const session = new this.sessionModel({
              userId: userIdString,
              sessionId: this.socket!.user.id,
              isActive: true,
            });

            await session.save();
            resolve(session);
          } else if (qr) {
            console.log(`Scan the QR code to connect:`);
            qrcode.generate(qr, { small: true });
            this.qrCache.set(userIdString, qr);
          }
        },
      );

      this.socket!.ev.on('creds.update', saveCreds);
    });
  }

  private async sendMessage(jid: string, content: string): Promise<void> {
    const message: AnyMessageContent = { text: content };
    await this.socket!.sendMessage(jid, message);
  }

  async getQRCode(userId: string): Promise<string | null> {
    return this.qrCache.get(String(userId)) || null;
  }

  async disconnectSession(userId: string): Promise<void> {
    console.log(`Disconnecting session for user: ${userId}`);
    const session = await this.sessionModel.findOne({ userId });
    if (!session) {
      console.warn(`No active session found for user: ${userId}`);
      return;
    }
    await this.cleanupPreviousSession(userId);
    await fs.remove('./auth_info');
    console.log(`Session for user: ${userId} has been disconnected.`);
  }

  private async cleanupPreviousSession(userId: string): Promise<void> {
    console.log(`Cleaning up existing sessions for user: ${userId}`);
    this.qrCache.del(userId);
    await this.sessionModel.deleteMany({ userId });
    console.log(`Deleted any existing sessions for user: ${userId}`);
  }

  private async getUserStatus(userId: string): Promise<string> {
    return 'occupy';
  }
}
