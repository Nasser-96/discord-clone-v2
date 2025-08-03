import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DirectMessageEventEnum } from 'src/helper/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketWithAuth } from 'src/types';

@WebSocketGateway({ cors: true, namespace: '/direct-message' })
export class DirectMessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(DirectMessageGateway.name);
  constructor(private readonly prismaService: PrismaService) {}

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.logger.debug(`Websocket DirectMessageGateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    this.logger.debug(`Client connected: ${client?.username}`);
  }

  async handleDisconnect(client: SocketWithAuth) {
    this.logger.log(`Disconnected socket id: ${client.username}`);
  }

  emitToAll(eventName: string, eventData: any) {
    this.server.emit(eventName, eventData);
  }

  // We connect the client to a conversation room if they are part of it
  @SubscribeMessage(DirectMessageEventEnum.JOIN_CONVERSATION)
  async handleJoinConversation(
    client: SocketWithAuth,
    data: { conversationId: string },
  ) {
    const userId = client.user_id;
    const conversationId = data?.conversationId;

    if (!conversationId) {
      this.logger.error('No conversation ID provided');
      return;
    }

    const conversation = await this.prismaService.conversation.findFirst({
      where: {
        id: data.conversationId,
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
    });

    if (conversation) {
      // Join the client to the conversation room
      client.join(conversationId);
      this.logger.log(
        `Client ${client.username} joined conversation ${conversationId}`,
      );
    }
  }
}
