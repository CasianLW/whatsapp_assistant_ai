import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecialCode, SpecialCodeDocument } from './schemas/specialcode.schema';

@Injectable()
export class SpecialCodesService {
  constructor(
    @InjectModel(SpecialCode.name)
    private specialCodeModel: Model<SpecialCodeDocument>,
  ) {}

  async createSpecialCode(
    code: string,
    credits: number,
    maxUsage: number,
    expiresAt: Date,
  ): Promise<SpecialCode> {
    const newSpecialCode = new this.specialCodeModel({
      code,
      credits,
      maxUsage,
      expiresAt,
    });
    return newSpecialCode.save();
  }

  async findAll(): Promise<SpecialCode[]> {
    return this.specialCodeModel.find().exec();
  }

  async findById(id: string): Promise<SpecialCode> {
    const specialCode = await this.specialCodeModel.findById(id).exec();
    if (!specialCode) {
      throw new NotFoundException(`Special code with ID ${id} not found`);
    }
    return specialCode;
  }

  async updateSpecialCode(
    id: string,
    updateData: Partial<SpecialCode>,
  ): Promise<SpecialCode> {
    const updatedSpecialCode = await this.specialCodeModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedSpecialCode) {
      throw new NotFoundException(`Special code with ID ${id} not found`);
    }

    return updatedSpecialCode;
  }

  async deleteSpecialCode(id: string): Promise<{ message: string }> {
    const result = await this.specialCodeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Special code with ID ${id} not found`);
    }
    return { message: `Special code with ID ${id} has been deleted` };
  }
}
