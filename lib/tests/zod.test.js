const fastify = require('fastify');
const customHealthCheck = require('../');
const {
  serializerCompiler,
  validatorCompiler
} = require('fastify-type-provider-zod');
const { z } = require('zod');

describe('Zod type provider', () => {
  let app;
  beforeEach(async () => {
    app = fastify();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
  });

  afterEach(async () => {
    await app.close();
  });

  it('Works with zod type provider without schema', async () => {
    await app.register(customHealthCheck, {
      path: '/health',
      schema: false
    });
    await app.ready();

    const response = await app.inject().get('/health');
    expect(response.statusCode).toBe(200);
  });

  it('Works with zod type provider with zod schema', async () => {
    await app.register(customHealthCheck, {
      path: '/health',
      schema: {
        response: {
          200: z.object({
            healthChecks: z.optional(z.record(z.string())),
            stats: z.any(),
            info: z.optional(z.record(z.string()))
          })
        }
      }
    });
    await app.ready();

    const response = await app.inject().get('/health');
    expect(response.statusCode).toBe(200);
  });
});
