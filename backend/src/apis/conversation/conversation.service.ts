import { Injectable } from '@nestjs/common';
import ReturnResponse from 'src/helper/returnResponse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prismaService: PrismaService) {}

  async getOrCreateDirectConversationService(
    currentUserId: string,
    targetUserId: string,
  ) {
    const sortedIds = [currentUserId, targetUserId].sort();
    const [userOneId, userTwoId] = sortedIds;

    const response =
      (await this.getConversation(userOneId, userTwoId)) ||
      (await this.createConversation(userOneId, userTwoId));

    return ReturnResponse({
      response: response,
      success: 'Conversation found successfully',
      is_successful: true,
    });
  }

  // 2. Create new conversation (used internally)
  private async createConversation(userOneId: string, userTwoId: string) {
    return this.prismaService.conversation.create({
      data: {
        userOneId,
        userTwoId,
      },
    });
  }

  // 3. Get conversation if it exists (used internally)
  private async getConversation(userOneId: string, userTwoId: string) {
    return this.prismaService.conversation.findFirst({
      where: {
        userOneId,
        userTwoId,
      },
      select: {
        id: true,
        userOneId: true,
        userTwoId: true,
      },
    });
  }

  public async getConversationService(
    conversationId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [response, totalMessages] = await this.prismaService.$transaction([
      this.prismaService.conversation.findFirst({
        where: {
          id: conversationId,
        },
        select: {
          userOne: {
            select: {
              id: true,
              username: true,
              image: true,
              email: true,
            },
          },
          userTwo: {
            select: {
              id: true,
              username: true,
              image: true,
              email: true,
            },
          },
          messages: {
            where: {
              deleted: false, // Ensure we only fetch non-deleted messages
            },
            select: {
              id: true,
              content: true,
              createdAt: true,
              userId: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip: skip,
            take: limit,
          },
        },
      }),
      this.prismaService.directMessage.count({
        where: {
          conversationId: conversationId,
          deleted: false,
        },
      }),
    ]);

    const newResponse = {
      ...response,
      messages: response.messages,
      count: totalMessages,
    };

    return ReturnResponse({
      response: newResponse,
      success: 'Conversation found successfully',
      is_successful: true,
    });
  }
}
