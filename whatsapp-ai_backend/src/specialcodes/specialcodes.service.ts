import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecialCode } from './schemas/specialcode.schema';

@Injectable()
export class SpecialCodesService {
  constructor(
    @InjectModel('SpecialCode') private specialCodeModel: Model<SpecialCode>,
  ) {}

  async createSpecialCode(
    code: string,
    credits: number,
    maxUsage: number,
    expiresAt: Date,
  ): Promise<SpecialCode> {
    const newCode = new this.specialCodeModel({
      code,
      credits,
      maxUsage,
      expiresAt,
    });
    return newCode.save();
  }

  async redeemSpecialCode(userId: string, code: string): Promise<SpecialCode> {
    const specialCode = await this.specialCodeModel.findOne({ code });

    if (!specialCode || specialCode.expiresAt < new Date()) {
      throw new NotFoundException('Special code is invalid or expired.');
    }

    if (specialCode.maxUsage <= specialCode.timesUsed) {
      throw new NotFoundException(
        'Special code has reached its maximum usage limit.',
      );
    }

    // Perform additional logic if needed (e.g., track which users redeemed the special code)
    specialCode.timesUsed += 1;
    await specialCode.save();
    return specialCode;
  }

  async getAllSpecialCodes(): Promise<SpecialCode[]> {
    return this.specialCodeModel.find().exec();
  }

  async deleteSpecialCode(code: string): Promise<{ message: string }> {
    const result = await this.specialCodeModel.deleteOne({ code }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Special code with code "${code}" not found`);
    }
    return { message: `Special code "${code}" deleted successfully` };
  }
}
