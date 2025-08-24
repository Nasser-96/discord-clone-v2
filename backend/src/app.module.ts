import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './apis/auth/auth.module';
import { UploadModule } from './apis/upload/upload.module';
import { ServerModule } from './apis/server/server.module';
import { MemberModule } from './apis/member/member.module';
import { ChannelsModule } from './apis/channels/channels.module';
import { SocketModule } from './socket/socket.module';
import { ConversationModule } from './apis/conversation/conversation.module';
import { DirectMessageModule } from './apis/direct-message/direct-message.module';
import { MessagesModule } from './apis/messages/messages.module';
import { LiveKitModule } from './apis/live-kit/live-kit.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UploadModule,
    ServerModule,
    MemberModule,
    ChannelsModule,
    SocketModule,
    ConversationModule,
    DirectMessageModule,
    MessagesModule,
    LiveKitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
