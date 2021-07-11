import { Module } from '@nestjs/common';
import { RedisHandlerService } from './redis-handler.service';

@Module({
  providers: [RedisHandlerService]
})
export class RedisHandlerModule {}
