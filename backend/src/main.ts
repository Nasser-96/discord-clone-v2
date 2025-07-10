import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SetUpProject } from './set-up-project';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      bodyLimit: 50 * 1024 * 1024 /* 50 MB */,
    }),
  );

  await SetUpProject(app);

  await app.listen(process.env.PORT || 9000, '0.0.0.0');
}
bootstrap();
