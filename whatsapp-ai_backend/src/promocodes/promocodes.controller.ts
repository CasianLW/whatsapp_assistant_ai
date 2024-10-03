import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Request,
} from '@nestjs/common';
import { PromoCodesService } from './promocodes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin-guard';

@Controller('promocodes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('create')
  async createPromoCode(
    @Body('code') code: string,
    @Body('discount') discount: number,
    @Body('maxUsage') maxUsage: number,
    @Body('expiresAt') expiresAt: Date,
  ) {
    return this.promoCodesService.createPromoCode(
      code,
      discount,
      maxUsage,
      expiresAt,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('redeem')
  async redeemPromoCode(@Body('code') code: string, @Request() req) {
    const userId = req.user.userId; // Extract userId from the request object
    return this.promoCodesService.redeemPromoCode(userId, code);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':code')
  async deletePromoCode(@Param('code') code: string) {
    return this.promoCodesService.deletePromoCode(code);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllPromoCodes() {
    return this.promoCodesService.getAllPromoCodes();
  }
}
