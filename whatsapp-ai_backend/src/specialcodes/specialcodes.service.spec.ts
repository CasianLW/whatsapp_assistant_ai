import { Test, TestingModule } from '@nestjs/testing';
import { SpecialcodesService } from './specialcodes.service';

describe('SpecialcodesService', () => {
  let service: SpecialcodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialcodesService],
    }).compile();

    service = module.get<SpecialcodesService>(SpecialcodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
