import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { Stripe } from 'stripe';
import { User, UserSchema } from '../users/schemas/user.schema'; // Import User schema
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';

@Global()
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema }, // Register Transaction schema
    ]),
  ],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Stripe(
          configService.get('STRIPE_SECRET_KEY'),
          // , {
          //   apiVersion: '2022-11-15',
          // }
        );
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  controllers: [StripeController],
  exports: [StripeService, 'STRIPE_CLIENT'],
})
export class StripeModule {}
