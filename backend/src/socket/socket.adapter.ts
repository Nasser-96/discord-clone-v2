import { INestApplicationContext, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { SocketWithAuth } from 'src/types';

export class SocketIOAdapter extends IoAdapter {
  private server: Server | null = null;
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    this.server = super.createIOServer(port, options);

    const jwtService = this.app.get(JwtService);
    this.server.of('/').use(createTokenMiddleware(jwtService, this.logger));
    return this.server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, logger: Logger) =>
  (socket: SocketWithAuth, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];
    try {
      const payload = jwtService.verify(token, {
        secret: process.env.JSON_TOKEN_KEY,
      });
      socket.user_id = payload.id;
      socket.username = payload.username;

      next();
    } catch (error) {
      console.log(error);

      next(new Error('Invalid token'));
    }
  };
