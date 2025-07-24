import { BadGatewayException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreateServerDto } from './dto/create-server.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDataType } from '../auth/types';
import { MemberRole } from '@prisma/client';
import ReturnResponse from 'src/helper/returnResponse';

@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}
  async createServerService(
    userData: UserDataType,
    createServerDto: CreateServerDto,
  ) {
    try {
      const createdServer = await this.prisma.server.create({
        data: {
          name: createServerDto.name,
          image: createServerDto.image || null,
          members: {
            create: {
              userId: userData.id,
              role: MemberRole.ADMIN,
            },
          },
          channels: {
            create: [{ name: 'General', channelType: 'TEXT' }],
          },
        },
      });

      return ReturnResponse({
        response: createdServer,
        success: 'Server created successfully',
      });
    } catch (error) {
      console.log(error);

      throw new BadGatewayException(
        ReturnResponse({
          is_successful: false,
          error_msg: 'Failed to create server',
        }),
      );
    }
  }

  async getMyServersService(userData: UserDataType) {
    const myServersRaw = await this.prisma.server.findMany({
      where: {
        members: {
          some: {
            userId: userData.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    const myServers = myServersRaw.map((server) => {
      const newServer = {
        ...server,
        memberCount: server._count.members,
      };
      delete newServer._count;
      return newServer;
    });

    const myServersResponse = ReturnResponse({
      is_successful: true,
      response: [...myServers],
    });
    return myServersResponse;
  }

  async getServerDataService(userData: UserDataType, serverId: string) {
    const foundServer = await this.prisma.server.findFirst({
      where: {
        id: serverId,
      },
      include: {
        channels: true,
        members: {
          orderBy: {
            role: 'asc',
          },

          select: {
            role: true,
            id: true,
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const userRole = foundServer?.members?.find(
      (member) => member.user?.id === userData.id,
    )?.role;

    return ReturnResponse({
      is_successful: true,
      response: {
        ...foundServer,
        memberRole: userRole,
      },
    });
  }

  async updateInviteCodeService(serverId: string) {
    const updatedServer = await this.prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        inviteCode: uuidv4(),
      },
      include: {
        members: true,
      },
    });
    return ReturnResponse({
      is_successful: true,
      response: {
        inviteCode: updatedServer.inviteCode,
      },
    });
  }

  async addUserToServerService(inviteCode: string, userData: UserDataType) {
    const server = await this.prisma.server.findUnique({
      where: {
        inviteCode: inviteCode,
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    await this.prisma.server.update({
      where: {
        id: server.id,
      },
      data: {
        members: {
          create: {
            userId: userData.id,
            role: MemberRole.USER,
          },
        },
      },
    });

    const response = ReturnResponse({
      is_successful: true,
      response: {
        ...server,
      },
    });

    return response;
  }

  async updateServerService(
    serverId: string,
    updateServerDto: CreateServerDto,
  ) {
    const updatedServer = await this.prisma.server.update({
      where: {
        id: serverId,
      },
      data: {
        name: updateServerDto.name,
        image: updateServerDto.image,
      },
    });

    return ReturnResponse({
      is_successful: true,
      response: updatedServer,
    });
  }

  async deleteServerService(serverId: string) {
    const deletedServer = await this.prisma.server.delete({
      where: {
        id: serverId,
      },
    });

    return ReturnResponse({
      is_successful: true,
      response: deletedServer,
    });
  }
}
