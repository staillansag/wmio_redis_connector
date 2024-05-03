module.exports = {
  label: "Connect to Redis",
  mock_input: {},
  input: {
    type: "object",
    title: "Redis Connection Configuration",
    oneOf: [
      {
        type: "object",
        title: "Basic Authentication",
        properties: {
          username: {
            type: "string",
            minLength: 1,
            title: "Username",
          },
          password: {
            type: "string",
            minLength: 1,
            format: "password",
            title: "Password",
          },
          authentificationType: {
            type: "string",
            default: "basic",
            options: {
              hidden: true,
            },
          },
        },
      }
    ],
    properties: {
      host: {
        type: "string",
        minLength: 1,
        title: "Redis host",
      },
      port: {
        type: "string",
        minLength: 1,
        title: "Redis port",
      },
      ssl: {
        type: "boolean",
        title: "SSL",
        description: "Enable SSL for the connection",
        default: false,
      }
    },
  },
  validate: async function (input, output) {
		const redis = require('redis');
		
		const host = input.auth.host;
		const port = input.auth.port;
		const username = input.auth.username;
		const password = input.auth.password;

		const fullUrl = `redis://${username}:${password}@${host}:${port}`;

		const client = redis.createClient({
			url: fullUrl
		});

		try {
			await client.connect();
			output(null, "Success");
		} catch (error) {
			output("Invalid Connection: " + error.message, null);
		} finally {
			await client.quit();
		}
	}
};
