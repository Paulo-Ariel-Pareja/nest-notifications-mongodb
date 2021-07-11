import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Logger, UseInterceptors } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { OwnerService } from './owner.service';
import { PropagationInterceptor } from '../interceptors/propagation.interceptor';
import { RedisHandlerService } from '../redis-handler/redis-handler.service';

@UseInterceptors(PropagationInterceptor)
@WebSocketGateway({ namespace: '/realtime' })
export class OwnerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private service: OwnerService,
    private readonly redis: RedisHandlerService
  ) { }

  @SubscribeMessage('msgToServer')
  public async handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
    const userJwt = client.handshake.headers['authorization'];
    const channels = await this.redis.getSockets(userJwt);
    const owner = await this.service.create(payload);
    channels.forEach(element => {
      client.to(element).emit('msgToClient', owner)
    });
    return client.emit('msgToClient', owner);
  };

  @SubscribeMessage('joinRoom')
  public async joinRoom(client: Socket, uuid: string): Promise<WsResponse<any>> {
    const userJwt = client.handshake.headers['authorization'];
    const channels = await this.redis.getSockets(userJwt);

    await this.redis.register(userJwt, client.id);
    client.join(uuid);
    client.emit('joinedRoom', uuid);
    this.logger.log(`Client JOIN: ${client.id} - with ${userJwt} - room ${uuid}`);
    const owner = await this.service.getMessagesActive(uuid);
    if (owner) {
      channels.forEach(element => {
        client.to(element).emit('msgToClient', owner)
      });
    }
    return client.emit('msgToClient', null);
  };

  @SubscribeMessage('leaveRoom')
  public async leaveRoom(client: Socket, room: string): Promise<void> {
    const userJwt = client.handshake.headers['authorization'];
    await this.redis.remove(userJwt, client.id);
    this.logger.log(`Client LEAVE: ${client.id} - with ${userJwt}`);
    client.leave(room);
    client.emit('leftRoomServer', room);
  }

  public afterInit(server: Server): void {
    return this.logger.log('---   Init gateway   ---');
  }

  public async handleDisconnect(client: Socket): Promise<void> {
    const userJwt = client.handshake.headers['authorization'];
    await this.redis.remove(userJwt, client.id);
    return this.logger.log(`Client disconnected: ${client.id} - with ${userJwt}`);
  }

  public async handleConnection(client: Socket): Promise<void> {
    const idUser = client.handshake.headers['authorization'];
    await this.redis.register(idUser, client.id);
    return this.logger.log(`Client connected: ${client.id} - with ${idUser}`);
  }
}
