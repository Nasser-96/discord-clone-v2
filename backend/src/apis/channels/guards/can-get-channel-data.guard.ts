import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDataType } from 'src/apis/auth/types';
import ReturnResponse from 'src/helper/returnResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CanGetChannelDataChannel implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDataType;
    const { channelId } = request.params;
    const foundChannel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
      select: {
        server: {
          select: {
            members: {
              where: {
                userId: user?.id,
              },
            },
          },
        },
      },
    });

    const isMember = foundChannel?.server?.members?.length > 0;

    if (!isMember) {
      throw new UnauthorizedException(
        ReturnResponse({
          error_msg: 'Channel not found',
          is_successful: false,
        }),
      );
    }
    return true;
  }
}
