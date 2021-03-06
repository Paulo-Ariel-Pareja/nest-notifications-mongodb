import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisHandlerService } from '../redis-handler/redis-handler.service';
import { OwnerSchema } from '../schemas/owner.schemas';
import { OwnerController } from './owner.controller';
import { OwnerGateway } from './owner.gateway';
import { OwnerService } from './owner.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Owner', schema: OwnerSchema }
        ])
    ],
    controllers: [OwnerController],
    providers: [OwnerService, OwnerGateway, RedisHandlerService]
})
export class OwnerModule { }
