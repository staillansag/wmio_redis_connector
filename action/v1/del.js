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
    const redis = require('redis');

    const client = redis.createClient({
      url: `redis://${input.auth.username}:${input.auth.password}@${input.auth.host}:${input.auth.port}`
    });

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
