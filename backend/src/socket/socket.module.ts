import { Module } from '@nestjs/common';
import { SocketIOAdapter } from './socket.adapter';

@Module({
  providers: [SocketIOAdapter],
  exports: [SocketIOAdapter],
})
export class SocketModule {}
