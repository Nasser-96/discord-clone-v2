import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import ReturnResponse from 'src/helper/returnResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IsOwnerDirectMessage implements CanActivate {
  constructor(private prismaService: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // Assuming the authenticated user's ID is in req.user.id
    const directMessageId = request.params.messageId;

    const foundRelatedMessage =
      await this.prismaService.directMessage.findFirst({
        where: {
          id: directMessageId,
          userId, // Check if the user is the owner of the message
        },
      });

    if (!foundRelatedMessage) {
      throw new NotFoundException(
        ReturnResponse({
          error_msg:
            'Direct message not found or you do not have permission to update it',
          is_successful: false,
        }),
      );
    }

    return true; // Implement your logic to check if the user can update the direct message
  }
}
