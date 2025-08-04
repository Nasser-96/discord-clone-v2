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
  Put,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanGetChannelDataChannel } from '../channels/guards/can-get-channel-data.guard';
import { CanUpdateChannelMessageGuard } from './guards/can-update-message.guard';
import { CanDeleteChannelMessageGuard } from './guards/can-delete-message.guard';

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
    return this.messagesService.createService(
      createMessageDto,
      channelId,
      userId,
    );
  }

  @Put('update/:messageId')
  @UseGuards(AuthGuard, CanUpdateChannelMessageGuard)
  update(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Req() req: any,
  ) {
    return this.messagesService.updateService(messageId, updateMessageDto);
  }

  @Delete('delete/:messageId')
  @UseGuards(AuthGuard, CanDeleteChannelMessageGuard)
  delete(@Param('messageId') messageId: string) {
    return this.messagesService.deleteService(messageId);
  }
}
