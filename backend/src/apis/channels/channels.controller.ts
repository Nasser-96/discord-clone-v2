import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CanCreateChannel } from './guards/can-create-channel.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanUpdateChannel } from './guards/can-update-channel.guard';
import { CanGetChannelDataChannel } from './guards/can-get-channel-data.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('channel/:channelId')
  @UseGuards(AuthGuard, CanGetChannelDataChannel)
  getChannelData(@Param('channelId') channelId: string) {
    return this.channelsService.getChannelData(channelId);
  }

  @Get('channel/:channelId/messages')
  @UseGuards(AuthGuard, CanGetChannelDataChannel)
  findAll(
    @Param('channelId') channelId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.channelsService.getChannelMessages(
      channelId,
      Number(page),
      Number(limit),
    );
  }

  @Post('create/:serverId')
  @UseGuards(AuthGuard, CanCreateChannel)
  create(
    @Body() createChannelDto: CreateChannelDto,
    @Param('serverId') serverId: string,
  ) {
    return this.channelsService.createChannelService(
      createChannelDto,
      serverId,
    );
  }

  @Patch('update/:channelId')
  @UseGuards(AuthGuard, CanUpdateChannel)
  update(
    @Param('channelId') channelId: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelsService.updateChannelService(
      channelId,
      updateChannelDto,
    );
  }

  @Delete('delete/:channelId')
  @UseGuards(AuthGuard, CanUpdateChannel)
  remove(@Param('channelId') channelId: string) {
    return this.channelsService.removeChannelService(channelId);
  }
}
