import fastify from 'fastify';
import cors from '@fastify/cors';
import compression from '@fastify/compress';
import { createYoga } from 'graphql-yoga';
import { schema } from './api/schema.js';
import { createContext } from './context.js';
import envVars from './config/envVars.js';
import { logger } from './config/logger.js';
import { errorHandler } from './handlers/error.handler.js';

async function startServer() {
  const app = fastify({
    logger: logger,
    disableRequestLogging: true, // We'll handle logging manually
  });

  // Register plugins
  await app.register(cors);
  await app.register(compression, { encodings: ['gzip', 'deflate'] });

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  // Create Yoga instance
  const yoga = createYoga({
    schema,
    logging: logger,
    context: createContext,
    // Add envelop plugins for optimization
    plugins: [
      // Add rate limiting, data loader, etc. here
    ],
  });

  // Mount Yoga on /graphql
  app.route({
    url: yoga.graphqlEndpoint,
    method: ['GET', 'POST', 'OPTIONS'],
    handler: async (req, reply) => {
      const response = await yoga.handleNodeRequest(req, {
        req,
        reply,
      });
      for (const [name, value] of response.headers) {
        reply.header(name, value);
      }
      reply.status(response.status);
      reply.send(response.body);
      return reply;
    },
  });

  // Error handler
  app.setErrorHandler(errorHandler);

  try {
    app.listen({ port: parseInt(envVars.PORT, 10), host: '0.0.0.0' });
    logger.info(`🚀 Server is running in ${envVars.NODE_ENV} mode on port ${envVars.PORT}`);
    logger.info(`📊 GraphQL endpoint: http://localhost:${envVars.PORT}${yoga.graphqlEndpoint}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

export default startServer;