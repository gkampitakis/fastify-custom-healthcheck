'use strict';

const response = {
  type: 'object',
  properties: {
    healthChecks: {
      type: 'object',
      additionalProperties: true
    },
    stats: {
      type: 'object',
      properties: {
        creationTime: { type: 'string', format: 'date-time' },
        uptime: { type: 'number' },
        memory: {
          type: 'object',
          properties: {
            rss: { type: 'number' },
            heapTotal: { type: 'number' },
            heapUsed: { type: 'number' },
            external: { type: 'number' },
            arrayBuffers: { type: 'number' }
          }
        }
      }
    },
    info: {
      type: 'object',
      additionalProperties: true
    }
  },
  required: ['stats']
};

const healthSchema = {
  description: 'Fastify plugin detecting every check passes',
  produces: ['application/json'],
  tags: ['fastify-custom-healthcheck'],
  summary: 'Health check route',
  response: {
    200: {
      description: 'All health checks passed',
      ...response
    },
    500: {
      description: 'Health checks failed',
      ...response
    }
  }
};

module.exports = healthSchema;
