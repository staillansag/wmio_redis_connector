module.exports = {
    name: "HGETALL",
    title: "HGETALL",
    description: "Retrieve all key-value pairs from a hash in specified format",
    version: "v1",
    input: {
        title: "HGETALL",
        type: "object",
        properties: {
            hash: {
                type: "string",
                minLength: 1,
                title: "hash"
            },
            outputType: {
                type: "string",
                enum: ["key-value", "json"],
                title: "Output Type"
            }
        }
    },
    output: {
        title: "output",
        type: "object",
        properties: {
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
            },
            json: {
                type: "object",
                additionalProperties: true,
                title: "JSON Object"
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

            const results = await client.hGetAll(input.hash);
            if (input.outputType === "key-value") {
                const kvpairs = Object.entries(results).map(([key, value]) => ({ key, value }));
                output(null, { kvpairs });
            } else if (input.outputType === "json") {
                output(null, { json: results });
            } else {
                output(new Error("Invalid output type specified"));
            }
        } catch (err) {
            output(err);
        } finally {
            if (client.isOpen) {
                await client.disconnect();
            }
        }
    }
};
