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
  async create(
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
}
