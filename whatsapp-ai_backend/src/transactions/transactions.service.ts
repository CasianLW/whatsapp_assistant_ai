import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  // Create a new transaction
  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = new this.transactionModel(data);
    return transaction.save();
  }

  // Retrieve all transactions for a specific user
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Retrieve all transactions (for admin)
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionModel
      .find()
      .populate('userId')
      .sort({ createdAt: -1 })
      .exec();
  }
}
