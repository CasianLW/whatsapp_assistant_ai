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
import { SpecialCodesService } from './specialcodes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin-guard';

@Controller('specialcodes')
export class SpecialCodesController {
  constructor(private readonly specialCodesService: SpecialCodesService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('create')
  async createSpecialCode(
    @Body('code') code: string,
    @Body('credits') credits: number,
    @Body('maxUsage') maxUsage: number,
    @Body('expiresAt') expiresAt: Date,
  ) {
    return this.specialCodesService.createSpecialCode(
      code,
      credits,
      maxUsage,
      expiresAt,
    );
  }

  // The user ID is extracted directly from the JWT token
  @UseGuards(JwtAuthGuard)
  @Post('redeem')
  async redeemSpecialCode(@Body('code') code: string, @Request() req) {
    const userId = req.user.userId; // Extract userId from the authenticated request object
    return this.specialCodesService.redeemSpecialCode(userId, code);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':code')
  async deleteSpecialCode(@Param('code') code: string) {
    return this.specialCodesService.deleteSpecialCode(code);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllSpecialCodes() {
    return this.specialCodesService.getAllSpecialCodes();
  }
}
