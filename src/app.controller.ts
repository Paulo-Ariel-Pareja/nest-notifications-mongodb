import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRedis, Redis } from '@svtslv/nestjs-ioredis';
@Controller()
export class AppController {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly appService: AppService) {}

  @Get('/test')
  async getHello() {
    // return this.appService.getHello();
    await this.redis.set('key', JSON.stringify({
      "uuid": "sarasa",
      "messages": [
          {"message": "nuevo2"}
      ]
  }));
    const redisData = await this.redis.get("key2");
    return { redisData };
  }
}
