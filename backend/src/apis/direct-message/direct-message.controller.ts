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
import { IsOwnerDirectMessage } from './guards/can-update-direct-message.guard';
import { UserDataType } from '../auth/types';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('direct-message')
export class DirectMessageController {
  constructor(private readonly directMessageService: DirectMessageService) {}

  @Post('send/:conversationId')
  @UseGuards(AuthGuard, CanGetConversation) // Assuming you have an AuthGuard to protect this route
  send(
    @Body() createDirectMessageDto: CreateDirectMessageDto,
    @Param('conversationId') conversationId: string,
    @GetUser() user: UserDataType,
  ) {
    const userId = user.id;
    return this.directMessageService.createService(
      createDirectMessageDto,
      conversationId,
      userId,
    );
  }

  @Put('update/:messageId')
  @UseGuards(AuthGuard, IsOwnerDirectMessage)
  update(
    @Param('messageId') id: string,
    @Body() updateDirectMessageDto: UpdateDirectMessageDto,
  ) {
    return this.directMessageService.updateService(id, updateDirectMessageDto);
  }

  @Delete('delete/:messageId')
  @UseGuards(AuthGuard, IsOwnerDirectMessage)
  delete(@Param('messageId') id: string) {
    return this.directMessageService.deleteService(id);
  }
}
