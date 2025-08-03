import { Module } from '@nestjs/common';
import { SocketIOAdapter } from './socket.adapter';
import { DirectMessageGateway } from './direct-message.gateway';
import { ChannelMessageGateway } from './channel-message.gateway';

@Module({
  providers: [SocketIOAdapter, DirectMessageGateway, ChannelMessageGateway],
  exports: [SocketIOAdapter, DirectMessageGateway, ChannelMessageGateway],
})
export class SocketModule {}
