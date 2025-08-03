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
export class CanGetConversation implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDataType;
    const { conversationId } = request.params;
    const foundConversation = await this.prismaService.conversation.findFirst({
      where: {
        AND: [
          { id: conversationId },
          {
            OR: [{ userOneId: user.id }, { userTwoId: user.id }],
          },
        ],
      },
    });
    if (!foundConversation) {
      throw new UnauthorizedException(
        ReturnResponse({
          error_msg: 'Conversation not found',
          is_successful: false,
        }),
      );
    }
    return true;
  }
}
