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

  async createService(
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

  async updateService(
    id: string,
    updateDirectMessageDto: UpdateDirectMessageDto,
  ) {
    console.log('ID', id);

    const updatedMessage = await this.prismaService.directMessage.update({
      where: { id: id }, // Ensure the user is the owner of the message
      data: {
        content: updateDirectMessageDto.content,
      },
      select: {
        id: true,
        content: true,
        conversationId: true,
        userId: true,
      },
    });

    if (updatedMessage) {
      this.directMessageSocket.server
        .to(updatedMessage.conversationId)
        .emit(DirectMessageEventEnum.DIRECT_MESSAGE_UPDATE, {
          message: {
            id: updatedMessage.id,
            content: updatedMessage.content,
          },
          senderId: updatedMessage.userId,
        });
    }

    return ReturnResponse({
      response: updatedMessage,
      success: 'Direct message updated successfully',
      is_successful: true,
    });
  }

  async deleteService(messageId: string) {
    const deletedMessage = await this.prismaService.directMessage.update({
      where: { id: messageId }, // Ensure the user is the owner of the message
      data: {
        deleted: true, // Mark the message as deleted
      },
      select: {
        id: true,
        conversationId: true,
        userId: true,
      },
    });

    if (deletedMessage) {
      this.directMessageSocket.server
        .to(deletedMessage.conversationId)
        .emit(DirectMessageEventEnum.DELETE_DIRECT_MESSAGE, {
          message: {
            id: deletedMessage.id,
          },
          senderId: deletedMessage.userId,
        });
    }

    return ReturnResponse({
      response: deletedMessage,
      success: 'Direct message deleted successfully',
      is_successful: true,
    });
  }
}
