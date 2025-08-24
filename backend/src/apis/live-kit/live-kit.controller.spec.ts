import { Test, TestingModule } from '@nestjs/testing';
import { LiveKitController } from './live-kit.controller';
import { LiveKitService } from './live-kit.service';

describe('LiveKitController', () => {
  let controller: LiveKitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveKitController],
      providers: [LiveKitService],
    }).compile();

    controller = module.get<LiveKitController>(LiveKitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
