import { Injectable } from '@nestjs/common';
import { CreateDirectMessageDto } from './dto/create-direct-message.dto';
import { UpdateDirectMessageDto } from './dto/update-direct-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectMessageGateway } from 'src/socket/direct-message.gateway';
import { DirectMessageEventEnum } from 'src/helper/enums';
import ReturnResponse from 'src/helper/returnResponse';

@Injectable()
export class DirectMessageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly directMessageSocket: DirectMessageGateway,
  ) {}

  async create(
    createDirectMessageDto: CreateDirectMessageDto,
    conversationId: string,
    userId: string,
  ) {
    const createdMessage = await this.prismaService.directMessage.create({
      data: {
        content: createDirectMessageDto.content,
        conversationId: conversationId,
        userId: userId,
      },
    });

    if (createdMessage) {
      this.directMessageSocket.server
        .to(conversationId)
        .emit(DirectMessageEventEnum.DIRECT_MESSAGE, {
          message: { id: createdMessage?.id, content: createdMessage?.content },
          senderId: userId,
        });
    }
    return ReturnResponse({
      response: createdMessage,
      success: 'Direct message sent successfully',
      is_successful: true,
    });
  }
}
