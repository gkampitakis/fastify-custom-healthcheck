const fastify = require('fastify')();
const MongoClient = require('mongodb').MongoClient;
const customHealthCheck = require('../lib');
const url = 'mongodb://localhost:27017';
const _package = require('../package.json');

fastify.register(customHealthCheck, {
  path: '/custom/path/health',
  info: {
    example: 'Custom Info',
    env: process.env.NODE_ENV,
    name: _package.name,
    version: _package.version
  },
  exposeFailure: true
})
  .then(() => {
    fastify.addHealthCheck('random', () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() * 100 > 50 ? resolve() : reject(new Error('Random Error'));
        }, 5000);
      });
    });

    fastify.addHealthCheck('async', () => {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    });

    fastify.addHealthCheck('mongo', async () => {
      const client = await MongoClient.connect(url);
      client.db('example');

      client.close();
    });

    fastify.addHealthCheck('sync', () => true);

    fastify.addHealthCheck('evaluationCheck', () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(true), 2000);
      });
    }, { value: false });
  });

fastify.listen(5000, () => {
  console.log('🚀 Example Server listening on port 5000');
});
