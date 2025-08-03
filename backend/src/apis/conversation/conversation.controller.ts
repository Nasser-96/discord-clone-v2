import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanGetConversation } from './guards/can-get-conversation.guard';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('conversation-id/:targetUserId')
  @UseGuards(AuthGuard)
  getDirectConversation(
    @Param('targetUserId') targetUserId: string,
    @Req() req: any,
  ) {
    const currentUserId = req.user.id; // Assuming the authenticated user's ID is in req.user.id
    return this.conversationService.getOrCreateDirectConversationService(
      targetUserId,
      currentUserId,
    );
  }

  @Get('conversation/:conversationId')
  @UseGuards(AuthGuard, CanGetConversation)
  getDirectConversationByTargetUserId(
    @Param('conversationId') conversationId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.conversationService.getConversationService(
      conversationId,
      Number(page),
      Number(limit),
    );
  }
}
