import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-session')
  async createSession(@Request() req) {
    const userId = req.user.userId;
    return this.whatsappService.createSession(userId);
  }

  @Get('poll-qr/:userId') // Polling route to check QR code availability
  async pollQRCode(@Param('userId') userId: string) {
    const qrCode = await this.whatsappService.getQRCode(userId);
    if (!qrCode) {
      return { qr: null, status: 'pending' }; // If no QR code yet, return pending
    }
    return { qr: qrCode, status: 'ready' };
  }
}
