import { CanActivate, Injectable, NotFoundException } from '@nestjs/common';
import { MemberRole } from '@prisma/client';
import ReturnResponse from 'src/helper/returnResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CanDeleteChannelMessageGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { messageId } = request.params;

    const message = await this.prismaService.message.findUnique({
      where: { id: messageId },
      include: {
        member: {
          select: { userId: true }, // Assuming you have a role field in your member model
        },
      },
    });

    const userRole = await this.prismaService.member.findFirst({
      where: { userId: user.id },
      select: { role: true },
    });

    console.log(
      `User ID: ${user.id}, Message Member User ID: ${userRole?.role}`,
    );

    const isSelfUser = user.id === message.member?.userId;
    const isAdmin =
      userRole?.role === MemberRole.ADMIN ||
      userRole?.role === MemberRole.MODERATOR;

    // Check if the user is the author of the message
    if (isSelfUser || isAdmin) {
      return true;
    } else {
      throw new NotFoundException(
        ReturnResponse({
          is_successful: false,
          error_msg:
            'You do not have permission to delete this message or it does not exist.',
        }),
      );
    }
  }
}
