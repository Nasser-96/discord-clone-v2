import { Module } from '@nestjs/common';
import { LiveKitService } from './live-kit.service';
import { LiveKitController } from './live-kit.controller';

@Module({
  controllers: [LiveKitController],
  providers: [LiveKitService],
})
export class LiveKitModule {}
