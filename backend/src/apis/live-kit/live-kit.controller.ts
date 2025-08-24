import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Req,
  Get,
} from '@nestjs/common';
import { LiveKitService } from './live-kit.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IsJoinedServerGuard } from '../server/guards/is-joined-server.guard';

@Controller('live-kit')
export class LiveKitController {
  constructor(private readonly liveKitService: LiveKitService) {}

  @Get('serverToken/:serverId/:channelId')
  @UseGuards(AuthGuard, IsJoinedServerGuard)
  create(@Param('channelId') channelId: string, @Req() req: any) {
    const user = req.user;
    return this.liveKitService.create(channelId, user);
  }
}
