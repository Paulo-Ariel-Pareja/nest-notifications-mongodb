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
import { PropagationInterceptor } from 'src/redis/propagation.interceptor';

@WebSocketGateway({ namespace: '/realtime' })
export class OwnerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  constructor(
    private service: OwnerService
  ) {}

  @UseInterceptors(PropagationInterceptor)
  @SubscribeMessage('msgToServer')
  public async handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
    const owner = await this.service.create(payload);
    client.broadcast.to(owner.uuid).emit('msgToClient', owner)
    return client.emit('msgToClient', owner);
  };

  @SubscribeMessage('joinRoom')
  public async joinRoom(client: Socket, uuid: string): Promise<WsResponse<any>> {
    client.join(uuid);
    client.emit('joinedRoom', uuid);
    const owner = await this.service.getMessagesActive(uuid);
    if (owner) {
      client.broadcast.to(uuid).emit('msgToClient', owner)
      return client.emit('msgToClient', owner);
    }
    return client.emit('msgToClient', null);
  };

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoomServer', room);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }
}
