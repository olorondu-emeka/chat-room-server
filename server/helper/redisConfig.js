import redis from 'redis';
import { config } from 'dotenv';

config();

let redisCient;
const REDIS_PORT = process.env.REDIS_PORT || 6432;

const redisConfig = {
  init: () => {
    redisCient = redis.createClient(REDIS_PORT);
    return redisCient;
  },
  getClient: () => {
    if (!redisCient) {
      throw new Error('Redis client not initiated');
    }
    return redisCient;
  }
};

export default redisConfig;
