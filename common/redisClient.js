const redis = require('redis');

function createRedisClient(auth) {
  const client = redis.createClient({
    url: `redis://${auth.username}:${auth.password}@${auth.host}:${auth.port}`
  });
  return client;
}

module.exports = {
  createRedisClient
};
