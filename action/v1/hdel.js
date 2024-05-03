module.exports = {
  name: "HDEL",
  title: "HDEL",
  description: "Delete key-value pairs related to a hash",
  version: "v1",
  input: {
    title: "HDEL",
    type: "object",
    properties: {
      hash: {
        type: "string",
        minLength: 1,
        title: "hash"
      },
      keys: {
        type: "array",
        title: "List of keys to be deleted",
        items: {
          type: "string",
          title: "Key to be deleted",
        }
      }
    }
  },
  output: {
    title: "output",
    type: "object",
    properties: {
      hash: {
        type: "string",
        title: "hash"
      },
      keys: {
        type: "array",
        title: "List of keys to be deleted",
        items: {
          type: "string",
          title: "Key to be deleted",
        }
      },
      result: {
        type: "string",
        title: "Result"
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

      const results = await client.hDel(input.hash, input.keys);
      output(null, {hash: input.hash, keys: input.keys, results: results});
    } catch (err) {
      output(err);
    } finally {
      if (client.isOpen) {
        await client.disconnect();
      }
    }
  }
};
