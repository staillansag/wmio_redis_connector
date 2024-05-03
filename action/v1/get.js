module.exports = {
  name: "GET",
  title: "GET",
  description: "Get a value",
  version: "v1",
  input: {
    title: "GET",
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
        minLength: 1,
        title: "key"
      },
      value: {
        type: "string",
        minLength: 1,
        title: "value"
      }
    }
  },
  mock_input: {},
  execute: async function (input, output) {

    const { createRedisClient } = require('../../common/redisClient');
    const client = createRedisClient(input.auth);

    try {
      await client.connect();

      const key = input.key;

      const result = await client.get(key);

      output(null, { key: key, value: result });
    } catch (err) {
      output(err);
    } finally {
      if (client.isOpen) { 
        await client.disconnect();
      }
    }
  }
};
