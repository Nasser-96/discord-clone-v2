import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import ReturnResponse from 'src/helper/returnResponse';
import { ChannelMessageGateway } from 'src/socket/channel-message.gateway';
import { ChannelMessageEventEnum } from 'src/helper/enums';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly channelSocket: ChannelMessageGateway,
  ) {}
  async createService(
    createMessageDto: CreateMessageDto,
    channelId: string,
    userId: string,
  ) {
    const member = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
        server: {
          channels: {
            some: {
              id: channelId,
            },
          },
        },
      },
      select: {
        id: true, // This is the memberId
      },
    });

    const { content } = createMessageDto;
    const createdMessage = await this.prismaService.message.create({
      data: {
        content: content,
        channelId: channelId,
        memberId: member?.id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        member: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
                email: true,
              },
            },
          },
        },
      },
    });

    this.channelSocket.server
      .to(channelId)
      .emit(ChannelMessageEventEnum.CHANNEL_MESSAGE, {
        id: createdMessage?.id,
        content: createdMessage?.content,
        createdAt: createdMessage?.createdAt,
        member: {
          user: createdMessage?.member?.user,
        },
      });

    return ReturnResponse({
      response: createdMessage,
      success: 'Message created successfully',
      is_successful: true,
    });
  }

  findAll(channelId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const totalMessages = this.prismaService.message.count({
      where: { channelId: channelId },
    });
    const messages = this.prismaService.message.findMany({
      where: { channelId: channelId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        member: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip: skip,
      take: limit,
    });

    return ReturnResponse({
      response: {
        messages: messages,
        count: totalMessages,
      },
      success: 'Messages retrieved successfully',
      is_successful: true,
    });
  }

  async updateService(messageId: string, updateMessageDto: UpdateMessageDto) {
    const { content } = updateMessageDto;

    const updatedMessage = await this.prismaService.message.update({
      where: { id: messageId },
      data: { content: content },
      select: {
        id: true,
        content: true,
        createdAt: true,
        channelId: true,
        member: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                image: true,
                email: true,
              },
            },
          },
        },
      },
    });

    this.channelSocket.server
      ?.to(updatedMessage?.channelId)
      .emit(ChannelMessageEventEnum.CHANNEL_MESSAGE_UPDATE, {
        id: updatedMessage?.id,
        content: updatedMessage?.content,
        createdAt: updatedMessage?.createdAt,
        member: {
          user: updatedMessage?.member?.user,
        },
      });

    return ReturnResponse({
      response: updatedMessage,
      success: 'Message updated successfully',
      is_successful: true,
    });
  }

  async deleteService(messageId: string) {
    const deletedMessage = await this.prismaService.message.update({
      where: { id: messageId },
      data: { deleted: true },
      select: {
        id: true,
        channelId: true,
      },
    });

    this.channelSocket.server
      ?.to(deletedMessage?.channelId)
      .emit(ChannelMessageEventEnum.CHANNEL_MESSAGE_DELETE, {
        id: deletedMessage?.id,
      });

    return ReturnResponse({
      response: deletedMessage,
      success: 'Message deleted successfully',
      is_successful: true,
    });
  }
}
