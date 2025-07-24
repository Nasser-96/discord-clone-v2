import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MemberRole } from '@prisma/client';
import { Request } from 'express';
import { UserDataType } from 'src/apis/auth/types';
import ReturnResponse from 'src/helper/returnResponse';
import { PrismaService } from 'src/prisma/prisma.service';

const RolePower = {
  [MemberRole.ADMIN]: 3,
  [MemberRole.MODERATOR]: 2,
  [MemberRole.USER]: 1,
};
@Injectable()
export class CanUpdateMemberGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const errorResponse = ReturnResponse({
      error_msg: 'You cannot update this member',
      is_successful: false,
    });

    const user = request.user as UserDataType;
    const { serverId, memberId } = request.params;

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
      throw new UnauthorizedException(errorResponse);
    }

    const targetMember = await this.prismaService.member.findFirst({
      where: {
        id: memberId,
        serverId,
      },
    });

    if (!targetMember) {
      throw new UnauthorizedException(
        ReturnResponse({
          error_msg: 'Target member not found',
          is_successful: false,
        }),
      );
    }

    const updaterPower = RolePower[foundUpdater.role];
    const targetPower = RolePower[targetMember.role];

    // 4. Check if updater has more power than target
    if (updaterPower <= targetPower) {
      throw new UnauthorizedException(errorResponse);
    }

    return true;
  }
}
