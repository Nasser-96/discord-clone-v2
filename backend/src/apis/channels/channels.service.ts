import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import ReturnResponse from 'src/helper/returnResponse';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getChannelData(channelId: string) {
    const foundChannel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
      select: {
        id: true,
        name: true,
        channelType: true,
        createdAt: true,
        serverId: true,
      },
    });

    const foundMessages = await this.prismaService.message.findMany({
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
    });

    return ReturnResponse({
      response: foundChannel,
      success: 'Channel data retrieved successfully',
      is_successful: true,
    });
  }

  async getChannelMessages(
    channelId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [foundMessages, totalMessages] =
      await this.prismaService.$transaction([
        this.prismaService.message.findMany({
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
          orderBy: { createdAt: 'desc' },
          skip: skip,
          take: limit,
        }),
        this.prismaService.message.count({
          where: { channelId: channelId },
        }),
      ]);

    return ReturnResponse({
      response: {
        messages: foundMessages,
        count: totalMessages,
      },

      success: 'Channel messages retrieved successfully',
      is_successful: true,
    });
  }

  async createChannelService(
    createChannelDto: CreateChannelDto,
    serverId: string,
  ) {
    const { name, channelType } = createChannelDto;
    const createdChannel = await this.prismaService.channel.create({
      data: {
        name: name,
        channelType: channelType,
        serverId: serverId,
      },
      select: {
        id: true,
        name: true,
        channelType: true,
        createdAt: true,
      },
    });

    return ReturnResponse({
      response: createdChannel,
      success: 'Channel created successfully',
      is_successful: true,
    });
  }

  async updateChannelService(channelId, updateChannelDto: UpdateChannelDto) {
    const { name } = updateChannelDto;

    const updatedChannel = await this.prismaService.channel.update({
      where: { id: channelId },
      data: {
        name: name,
      },
      select: {
        id: true,
        name: true,
        channelType: true,
        createdAt: true,
      },
    });

    return ReturnResponse({
      response: updatedChannel,
      success: 'Channel updated successfully',
      is_successful: true,
    });
  }

  async removeChannelService(channelId: string) {
    await this.prismaService.channel.delete({
      where: { id: channelId },
    });

    return ReturnResponse({
      success: 'Channel deleted successfully',
      is_successful: true,
    });
  }
}
