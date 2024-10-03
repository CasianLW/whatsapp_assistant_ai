import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SpecialcodesController } from './specialcodes/specialcodes.controller';
import { SpecialcodesService } from './specialcodes/specialcodes.service';
import { SpecialcodesModule } from './specialcodes/specialcodes.module';
import { PromocodesController } from './promocodes/promocodes.controller';
import { PromocodesService } from './promocodes/promocodes.service';
import { PromocodesModule } from './promocodes/promocodes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    SpecialcodesModule,
    PromocodesModule,
  ],
  controllers: [AppController, SpecialcodesController, PromocodesController],
  providers: [AppService, SpecialcodesService, PromocodesService],
})
export class AppModule {}
