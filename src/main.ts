import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { join } from "path";

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
