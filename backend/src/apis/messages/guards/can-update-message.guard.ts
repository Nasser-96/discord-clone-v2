import { CanActivate, Injectable, NotFoundException } from '@nestjs/common';
import ReturnResponse from 'src/helper/returnResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CanUpdateChannelMessageGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: any) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { messageId } = request.params;

    const message = await this.prismaService.message.findUnique({
      where: { id: messageId },
      include: {
        member: {
          select: { userId: true },
        },
      },
    });

    // Check if the user is the author of the message
    if (user.id !== message.member?.userId) {
      throw new NotFoundException(
        ReturnResponse({
          is_successful: false,
          error_msg:
            'You do not have permission to update this message or it does not exist.',
        }),
      );
    }

    // Optionally, you can add more checks here, like checking roles or permissions
    return true;
  }
}
