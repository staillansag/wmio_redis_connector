module.exports = {
  name: "DEL",
  title: "DEL",
  description: "Delete an entry",
  version: "v1",
  input: {
    title: "DEL",
    type: "object",
    properties: {
      key: {
        type: "string",
        minLength: 1,
        title: "key"
      }
    }
  },
  output: {
    title: "output",
    type: "object",
    properties: {
      key: {
        type: "string",
        title: "key"
      },
      result: {
        type: "string",
        title: "result"
      }
    }
  },
  mock_input: {},
  execute: async function (input, output) {

    const { createRedisClient } = require('../../common/redisClient');
    const client = createRedisClient(input.auth);

    try {
      await client.connect();

      const results = await client.del(input.key);
      output(null, {key: input.key, results: results});
    } catch (err) {
      output(err);
    } finally {
      if (client.isOpen) {
        await client.disconnect();
      }
    }
  }
};
