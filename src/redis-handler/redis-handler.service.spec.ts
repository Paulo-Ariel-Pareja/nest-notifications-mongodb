import { Test, TestingModule } from '@nestjs/testing';
import { RedisHandlerService } from './redis-handler.service';

describe('RedisHandlerService', () => {
  let service: RedisHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisHandlerService],
    }).compile();

    service = module.get<RedisHandlerService>(RedisHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
