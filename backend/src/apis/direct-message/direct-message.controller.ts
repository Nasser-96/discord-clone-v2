import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { DirectMessageService } from './direct-message.service';
import { CreateDirectMessageDto } from './dto/create-direct-message.dto';
import { UpdateDirectMessageDto } from './dto/update-direct-message.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanGetConversation } from '../conversation/guards/can-get-conversation.guard';

@Controller('direct-message')
export class DirectMessageController {
  constructor(private readonly directMessageService: DirectMessageService) {}

  @Post('send/:conversationId')
  @UseGuards(AuthGuard, CanGetConversation) // Assuming you have an AuthGuard to protect this route
  send(
    @Body() createDirectMessageDto: CreateDirectMessageDto,
    @Param('conversationId') conversationId: string,
    @Req() req: any,
  ) {
    const userId = req.user.id; // Assuming the authenticated user's ID is in req.user.id
    return this.directMessageService.create(
      createDirectMessageDto,
      conversationId,
      userId,
    );
  }

  @Put('update/:messageId')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDirectMessageDto: UpdateDirectMessageDto,
    @Req() req: any,
  ) {
    const userId = req.user.id; // Assuming the authenticated user's ID is in req.user.id
    return '';
    // return this.directMessageService.update(id, updateDirectMessageDto, userId);
  }
}
