import {
  BadGatewayException,
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import ReturnResponse from 'src/helper/returnResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CanAddUserToServer implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const foundServer = await this.prismaService.server.findUnique({
      where: {
        inviteCode: request.params.inviteCode,
      },
    });

    const foundMember = await this.prismaService.member.findFirst({
      where: {
        serverId: foundServer.id,
        userId: request.user.id,
      },
    });

    if (foundMember) {
      throw new ConflictException(
        ReturnResponse({
          error_msg: 'You are already a member of this server',
          is_successful: false,
        }),
      );
    }

    return true;
  }
}
