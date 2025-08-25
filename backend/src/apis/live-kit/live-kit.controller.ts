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
import { CanGetConversation } from '../conversation/guards/can-get-conversation.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserDataType } from '../auth/types';

@Controller('live-kit')
export class LiveKitController {
  constructor(private readonly liveKitService: LiveKitService) {}

  @Get('serverToken/:serverId/:channelId')
  @UseGuards(AuthGuard, IsJoinedServerGuard)
  create(@Param('channelId') channelId: string, @GetUser() user: UserDataType) {
    return this.liveKitService.create(channelId, user);
  }

  @Get('conversationToken/:conversationId')
  @UseGuards(AuthGuard, CanGetConversation)
  createForConversation(
    @Param('conversationId') conversationId: string,
    @GetUser() user: UserDataType,
  ) {
    console.log(user);

    return this.liveKitService.create(conversationId, user);
  }
}
