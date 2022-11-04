const fastify = require('fastify');
const customHealthCheck = require('../');
const {
  serializerCompiler,
  validatorCompiler
} = require('fastify-type-provider-zod');

describe('Zod type provider', () => {
  let app;
  beforeEach(async () => {
    app = fastify();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    await app.register(customHealthCheck, {
      path: '/health',
      schema: false
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Works with zod type provider', async () => {
    const response = await app.inject().get('/health');
    expect(response.statusCode).toBe(200);
  });
});
