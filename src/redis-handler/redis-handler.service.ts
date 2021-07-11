import { Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@svtslv/nestjs-ioredis';

@Injectable()
export class RedisHandlerService {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    async getSockets(uuid: string): Promise<any> {
        const data =  await this.redis.get(uuid);
        if (!data) return null;
        return JSON.parse(data);
    }

    async register(uuid, channel: string) {
        const session = await this.getSockets(uuid);
        if (!session) {
            await this.redis.set(uuid, JSON.stringify([channel]))
        } else {
            const exist = session.filter((key) => {
                return key === channel
            })
            if (exist.length === 0) {
                session.push(channel)
                await this.redis.set(uuid, JSON.stringify(session));
            }
        }
    };

    async remove(uuid, channel: string) {
        const session = await this.getSockets(uuid);
        if (!session) return;
        const left = session.filter((key) => {
            return key !== channel
        })
        await this.redis.set(uuid, JSON.stringify(left));
    }
}
