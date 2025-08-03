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
export class CanUpdateChannel implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDataType;
    const { channelId } = request.params;

    const channels = await this.prismaService.channel.findUnique({
      where: { id: channelId },
      select: {
        server: {
          select: {
            members: {
              where: {
                userId: user?.id,
                role: {
                  in: ['ADMIN', 'MODERATOR'],
                },
              },
            },
          },
        },
        name: true,
      },
    });

    console.log(channels?.name);

    const isAdmin = channels?.server?.members?.length > 0;

    if (channels?.name?.toLowerCase() === 'general') {
      throw new UnauthorizedException(
        ReturnResponse({
          error_msg: 'You cannot update the General channel',
          is_successful: false,
        }),
      );
    }

    if (!isAdmin) {
      throw new UnauthorizedException(
        ReturnResponse({
          error_msg:
            'You do not have permission to update a channel in this server',
          is_successful: false,
        }),
      );
    }
    return true;
  }
}
