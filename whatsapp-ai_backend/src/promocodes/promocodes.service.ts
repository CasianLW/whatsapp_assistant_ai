import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PromoCode } from './schemas/promocode.schema';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectModel('PromoCode') private promoCodeModel: Model<PromoCode>,
  ) {}

  async createPromoCode(
    code: string,
    discount: number,
    maxUsage: number,
    expiresAt: Date,
  ): Promise<PromoCode> {
    const newCode = new this.promoCodeModel({
      code,
      discount,
      maxUsage,
      expiresAt,
    });
    return newCode.save();
  }

  async redeemPromoCode(userId: string, code: string): Promise<PromoCode> {
    const promoCode = await this.promoCodeModel.findOne({ code });

    if (!promoCode || promoCode.expiresAt < new Date()) {
      throw new NotFoundException('Promo code is invalid or expired.');
    }

    if (promoCode.maxUsage <= promoCode.timesUsed) {
      throw new NotFoundException(
        'Promo code has reached its maximum usage limit.',
      );
    }

    // Perform additional logic if you need to track which users redeemed the promo code
    promoCode.timesUsed += 1;
    await promoCode.save();
    return promoCode;
  }

  async getAllPromoCodes(): Promise<PromoCode[]> {
    return this.promoCodeModel.find().exec();
  }

  async deletePromoCode(code: string): Promise<{ message: string }> {
    const result = await this.promoCodeModel.deleteOne({ code }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Promo code with code "${code}" not found`);
    }
    return { message: `Promo code "${code}" deleted successfully` };
  }
}
