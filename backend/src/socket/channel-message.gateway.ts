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
import {
  ChannelMessageEventEnum,
  DirectMessageEventEnum,
} from 'src/helper/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketWithAuth } from 'src/types';

@WebSocketGateway({ cors: true, namespace: '/channel' })
export class ChannelMessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChannelMessageGateway.name);
  constructor(private readonly prismaService: PrismaService) {}

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.logger.debug(`Websocket ChannelMessageGateway initialized.`);
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

  // We connect the client to a conversation room IF they are part of it
  @SubscribeMessage(ChannelMessageEventEnum.JOIN_CHANNEL)
  async handleJoinChannel(client: SocketWithAuth, data: { channelId: string }) {
    const { channelId } = data;
    if (!channelId) {
      this.logger.error('Channel ID is required to join a channel.');
      return;
    }
    const isMember = await this.prismaService.member.findFirst({
      where: {
        userId: client.user_id,
        server: {
          channels: {
            some: {
              id: channelId,
            },
          },
        },
      },
    });

    if (!isMember) {
      this.logger.error(
        `User ${client.username} is not a member of channel ${channelId}.`,
      );
      return;
    }

    client.join(channelId);
    this.logger.log(`Client ${client.username} joined channel ${channelId}.`);
  }
}
