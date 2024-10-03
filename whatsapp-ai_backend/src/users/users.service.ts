import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    console.log('UserModel:', this.userModel); // Check if UserModel is undefined
  }

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async updateCredits(userId: string, credits: number): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $inc: { credits } }, // Increment or decrement credits
        { new: true },
      )
      .exec();
  }
  //   async findByEmail(email: string): Promise<User> {
  //     const user = await this.userModel.findOne({ email }).exec();
  //     return user || null;
  //   }
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }
  //   async addCredits(userId: string, credits: number): Promise<User> {
  //     return this.userModel
  //       .findByIdAndUpdate(
  //         userId,
  //         { $inc: { credits } }, // Increment credits
  //         { new: true }, // Return the updated user
  //       )
  //       .exec();
  //   }
}
