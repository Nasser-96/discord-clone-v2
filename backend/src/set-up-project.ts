import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import ReturnResponse from './helper/returnResponse';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketIOAdapter } from './socket/socket.adapter';

const swaggerDocument = new DocumentBuilder()
  .setTitle('API')
  .setDescription('Discord Clone API Documentation')
  .setVersion('1.0')
  .addTag('API')
  .build();

export async function SetUpProject(app: NestFastifyApplication) {
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        throw new BadRequestException(
          ReturnResponse({
            response: validationErrors?.map((error) => ({
              field: error?.property,
              error: Object?.values(error?.constraints as any)?.join(', '),
            })),
            is_successful: false,
            error_msg: '',
            success: '',
          }),
        );
      },
    }),
  );

  const socketAdapter = new SocketIOAdapter(app);
  app.useWebSocketAdapter(socketAdapter);
  await app.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024 /* 50 MB */,
    },
  });

  await app.register(fastifyStatic, {
    root: join(__dirname, '../uploaded/images'), // Adjust based on your actual directory
    prefix: '/uploaded/images/', // URL path to access files,
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(app, swaggerDocument),
  );
}
