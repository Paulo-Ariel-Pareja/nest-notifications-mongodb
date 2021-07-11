import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { join } from "path";

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const whitelist = [
    'http://localhost:3500',
    'http://localhost:3501'
  ];
  const methods = "GET,PUT,POST,DELETE,UPDATE,OPTIONS,HEAD,PATCH";
  const allowedHeaders = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization, Origin"

  app.enableCors({
    origin: (origin, callback) => {
      if (whitelist.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    allowedHeaders,
    methods,
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 204
  });

  const options = new DocumentBuilder()
    .setTitle('Task example')
    .setDescription('The task API description')
    .setVersion('1.0')
    .addTag('task')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('swagger', app, document);

  const configService = app.get(ConfigService);
  const appPort = configService.get('appConfig.port');
  app.useStaticAssets(join(__dirname, '..', 'resource'));
  await app.listen(appPort);
  console.log(`Service running port ${appPort}`);
  Logger.log(
    `service running at port ${appPort}`,
    'notifications-socket',
  );
}
bootstrap();
