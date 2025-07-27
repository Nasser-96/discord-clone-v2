import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CanCreateChannel } from './guards/can-create-channel.guard';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

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
}
