import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialCodesService } from './specialcodes.service';
import { SpecialCodesController } from './specialcodes.controller';
import { SpecialCodeSchema } from './schemas/specialcode.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SpecialCode', schema: SpecialCodeSchema },
    ]), // Register the special code model
  ],
  providers: [SpecialCodesService],
  controllers: [SpecialCodesController],
  exports: [SpecialCodesService],
})
export class SpecialcodesModule {}
