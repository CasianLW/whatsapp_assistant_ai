import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCodesService } from './promocodes.service';
import { PromoCodesController } from './promocodes.controller';
import { PromoCodeSchema } from './schemas/promocode.schema'; // Ensure this path is correct

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PromoCode', schema: PromoCodeSchema }]), // Register PromoCode model
  ],
  providers: [PromoCodesService],
  controllers: [PromoCodesController],
  exports: [PromoCodesService], // Export the service to be used in other modules
})
export class PromoCodesModule {}
