import { Test, TestingModule } from '@nestjs/testing';
import { LiveKitService } from './live-kit.service';

describe('LiveKitService', () => {
  let service: LiveKitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveKitService],
    }).compile();

    service = module.get<LiveKitService>(LiveKitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
