import redis from 'redis';

let redisClient;

const redisConfig = {
  init: () => {
    redisClient = redis.createClient();
    return redisClient;
  },
  getClient: () => {
    if (!redisClient) {
      throw new Error('Redis client not initiated');
    }
    return redisClient;
  }
};

export default redisConfig;
