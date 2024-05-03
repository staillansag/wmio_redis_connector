module.exports = {
  name: "SET",
  title: "SET",
  description: "Store a string",
  version: "v1",
  input: {
    title: "SET",
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
  output: {
    title: "output",
    type: "object",
    properties: {
      key: {
        type: "string",
        title: "key"
      },
      value: {
        type: "string",
        title: "value"
      },
      result: {
        type: "string",
        title: "result"
      }
    }
  },
  mock_input: {},
  execute: async function (input, output) {
    const redis = require('redis');

    const client = redis.createClient({
      url: `redis://${input.auth.username}:${input.auth.password}@${input.auth.host}:${input.auth.port}`
    });

    try {
      await client.connect();

      const key = input.key;
      const value = input.value;

      const result = await client.set(key, value);

      output(null, { key: key, value: value, result: result });
    } catch (err) {
      output(err);
    } finally {
      if (client.isOpen) { 
        await client.disconnect();
      }
    }
  }
};
