module.exports = {
  name: "HSET",
  title: "HSET",
  description: "Set multiple fields in a hash",
  version: "v1",
  input: {
    title: "HSET",
    type: "object",
    properties: {
      hash: {
        type: "string",
        minLength: 1,
        title: "hash"
      },
      kvpairs: {
        type: "array",
        title: "Key Value pairs",
        items: {
          type: "object",
          title: "Key Value pair",
          properties: {
            key: {
              type: "string",
              minLength: 1,
              title: "key"
            },
            value: {
              type: "string",
              minLength: 1,
              title: "value" 
            }
          }
        }
      }
    }
  },
  output: {
    title: "output",
    type: "object",
    properties: {}
  },
  mock_input: {},
  execute: async function (input, output) {
    
    const { createRedisClient } = require('../../common/redisClient');
    const client = createRedisClient(input.auth);

    try {
      await client.connect();

      const hash = input.hash;
      const kvpairs = input.kvpairs;
      const args = kvpairs.reduce((acc, pair) => ({ ...acc, [pair.key]: pair.value }), {});

      const result = await client.hSet(hash, args);

      output(null, { hash: hash, result: result });
    } catch (err) {
      output(err);
    } finally {
      if (client.isOpen) { 
        await client.disconnect();
      }
    }
  }
};
