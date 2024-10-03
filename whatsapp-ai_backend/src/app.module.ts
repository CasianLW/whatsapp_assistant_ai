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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    SpecialcodesModule,
  ],
  controllers: [AppController, SpecialcodesController],
  providers: [AppService, SpecialcodesService],
})
export class AppModule {}
