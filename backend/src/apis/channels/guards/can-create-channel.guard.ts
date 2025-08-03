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
export class CanCreateChannel implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDataType;
    const { serverId } = request.params;

    const foundUpdater = await this.prismaService.member.findFirst({
      where: {
        user: { id: user?.id },
        serverId: serverId,
        AND: {
          role: {
            in: ['ADMIN', 'MODERATOR'], // Only allow admins and moderators to update members
          },
        },
      },
    });

    if (!foundUpdater) {
      throw new UnauthorizedException(
        ReturnResponse({
          error_msg:
            'You do not have permission to create a channel in this server',
          is_successful: false,
        }),
      );
    }
    return true;
  }
}
