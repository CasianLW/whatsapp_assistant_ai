import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SpecialcodesModule } from './specialcodes/specialcodes.module';
import { PromoCodesModule } from './promocodes/promocodes.module';

import { StripeModule } from './stripe/stripe.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    SpecialcodesModule,
    PromoCodesModule,
    StripeModule,
    TransactionsModule,
    WhatsAppModule,
  ],
  controllers: [AppController], // Remove SpecialcodesController and PromoCodesController
  providers: [AppService], // Remove SpecialcodesService and PromoCodesService
})
export class AppModule {}
