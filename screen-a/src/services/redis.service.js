const Redis = require('redis');
const logger = require('../config/logger');
const redisClient = Redis.createClient();

redisClient.connect().then(() => {
  logger.info('Redis Connection Established');
})

const redisHelper = async function getSetCache(key, cb) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await redisClient.get(key);
      if(data !== null) {
        console.log('Cache Hit');
        resolve(JSON.parse(data));
      } else {
        console.log('Cache Miss');
        const freshData = await cb();
        redisClient.set(key, JSON.stringify(freshData));
        resolve(freshData);
      }
    } catch (error) {
        return reject(error);
    }
  })
};

module.exports = redisHelper;