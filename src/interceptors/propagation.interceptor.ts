import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RedisHandlerService } from '../redis-handler/redis-handler.service';

@Injectable()
export class PropagationInterceptor implements NestInterceptor {


  constructor(
    private readonly redisService: RedisHandlerService
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): any {
    const socket = context.switchToWs().getClient();
    if(!socket.handshake.headers['authorization']) {
      return new BadRequestException('Not authorizated')
    }
    return next.handle()/* .pipe(
      tap(() => this.redisService.register('paulo', socket.id)),
    ); */
  }
}