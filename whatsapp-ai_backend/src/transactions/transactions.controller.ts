import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin-guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // User route to get their own transactions
  @UseGuards(JwtAuthGuard)
  @Get('user-history')
  async getUserTransactions(@Request() req) {
    const userId = req.user.userId; // Extract user ID from the request
    return this.transactionsService.getUserTransactions(userId);
  }

  // Admin route to get all transactions
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin-history')
  async getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }
}
