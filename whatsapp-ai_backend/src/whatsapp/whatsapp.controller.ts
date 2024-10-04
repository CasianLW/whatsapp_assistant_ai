import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppSession } from './schemas/whatsapp.schema';
import { UserRequest } from '../auth/interfaces/user-request.interface';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard) // Apply JWT Guard globally to all routes in this controller
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  // Create a new session and return the session data
  @Post('create-session')
  async createSession(@Request() req: UserRequest): Promise<WhatsAppSession> {
    const userId = req.user.userId; // Extract the userId from the authenticated user object
    return await this.whatsappService.createSession(userId);
  }

  // Poll for the QR code based on the userId from the JWT token
  @Get('poll-qr')
  async pollQRCode(@Request() req: UserRequest): Promise<{ qrCode: string }> {
    const userId = req.user.userId; // Extract the userId from the authenticated user object
    const qrCode = await this.whatsappService.getQRCode(userId);
    if (!qrCode) {
      throw new NotFoundException(`No QR code found for userId: ${userId}`);
    }
    return { qrCode };
  }

  // Disconnect the session for the userId from the JWT token
  @Delete('disconnect-session')
  async disconnectSession(
    @Request() req: UserRequest,
  ): Promise<{ message: string }> {
    const userId = req.user.userId; // Extract the userId from the authenticated user object
    await this.whatsappService.disconnectSession(userId);
    return { message: `Session for userId: ${userId} has been disconnected.` };
  }
}
