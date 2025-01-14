import { createClient } from 'redis';

const redisclient = createClient({
    username: process.env.REDIS_CLOUD_USERNAME,
    password: process.env.REDIS_CLOUD_PASSWORD,
    socket: {
        host: process.env.REDIS_CLOUD_SOCKET_HOST,
        port: process.env.REDIS_CLOUD_SOCKET_PORT ? parseInt(process.env.REDIS_CLOUD_SOCKET_PORT) : undefined
    }
});

await redisclient.connect();

redisclient.on('error', (err: any) => {
    console.error("Redis client error:", err);
});

export default redisclient;
