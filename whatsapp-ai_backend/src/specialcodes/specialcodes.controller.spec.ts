import { Test, TestingModule } from '@nestjs/testing';
import { SpecialcodesController } from './specialcodes.controller';

describe('SpecialcodesController', () => {
  let controller: SpecialcodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialcodesController],
    }).compile();

    controller = module.get<SpecialcodesController>(SpecialcodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
