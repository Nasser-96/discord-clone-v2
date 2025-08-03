import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanGetChannelDataChannel } from '../channels/guards/can-get-channel-data.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('channel/:channelId/create')
  @UseGuards(AuthGuard, CanGetChannelDataChannel)
  create(
    @Body() createMessageDto: CreateMessageDto,
    @Param('channelId') channelId: string,
    @Req() req: any,
  ) {
    const userId = req.user.id; // Assuming the authenticated user's ID is in req.user.id
    return this.messagesService.create(createMessageDto, channelId, userId);
  }
}
