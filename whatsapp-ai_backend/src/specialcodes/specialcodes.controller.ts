import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SpecialCodesService } from './specialcodes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin-guard';

@Controller('specialcodes')
export class SpecialCodesController {
  constructor(private readonly specialCodesService: SpecialCodesService) {}

  /**
   * Create a new special code. Requires admin privileges.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('create')
  async createSpecialCode(
    @Body('code') code: string,
    @Body('credits') credits: number,
    @Body('maxUsage') maxUsage: number,
    @Body('expiresAt') expiresAt: Date,
    @Request() req,
  ) {
    console.log('Creating special code for user:', req.user); // Debug the user object
    return this.specialCodesService.createSpecialCode(
      code,
      credits,
      maxUsage,
      expiresAt,
    );
  }

  /**
   * Retrieve all special codes.
   * Accessible by any authenticated user.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async findAllSpecialCodes() {
    return this.specialCodesService.findAll();
  }

  /**
   * Retrieve a specific special code by its ID.
   * Accessible by any authenticated user.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findSpecialCodeById(@Param('id') id: string) {
    return this.specialCodesService.findById(id);
  }

  /**
   * Update an existing special code.
   * Requires admin privileges.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async updateSpecialCode(
    @Param('id') id: string,
    @Body('code') code: string,
    @Body('credits') credits: number,
    @Body('maxUsage') maxUsage: number,
    @Body('expiresAt') expiresAt: Date,
  ) {
    return this.specialCodesService.updateSpecialCode(id, {
      code,
      credits,
      maxUsage,
      expiresAt,
    });
  }

  /**
   * Delete a special code by its ID.
   * Requires admin privileges.
   */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteSpecialCode(@Param('id') id: string) {
    return this.specialCodesService.deleteSpecialCode(id);
  }
}
