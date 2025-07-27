import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import ReturnResponse from 'src/helper/returnResponse';

@Injectable()
export class ChannelsService {
  constructor(private readonly prismaService: PrismaService) {}
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
}
