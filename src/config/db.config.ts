import { registerAs } from '@nestjs/config';

export default registerAs('dbConfig', () => ({

    port: Number(process.env.PORT) || 3000,
    country: process.env.CONTEX_COUNTRY || 'cl'
}));
