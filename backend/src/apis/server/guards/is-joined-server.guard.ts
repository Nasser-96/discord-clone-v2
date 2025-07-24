import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import ReturnResponse from 'src/helper/returnResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IsJoinedServerGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const errorResponse = ReturnResponse({
      error_msg: 'Server not found or you are not a member',
      is_successful: false,
    });
    try {
      const foundServer = await this.prismaService.server.findFirst({
        where: {
          id: request.params.serverId,
          members: {
            some: {
              userId: request.user.id,
            },
          },
        },
      });
      if (!foundServer) {
        throw new UnauthorizedException(errorResponse);
      }
    } catch (error) {
      throw new UnauthorizedException(errorResponse);
    }

    return true;
  }
}
