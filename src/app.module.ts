import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@svtslv/nestjs-ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnerModule } from './owner/owner.module';
import { RedisHandlerModule } from './redis-handler/redis-handler.module';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbConfig.uri'),
      }),
      inject: [ConfigService],
    }),
    OwnerModule,
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: { 
           host: '127.0.0.1',
           port: 7001,
        },
      }),
    }),
    RedisHandlerModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
