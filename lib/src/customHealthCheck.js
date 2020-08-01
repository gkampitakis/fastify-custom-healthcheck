'use strict';

const stats = require('./stats');
const Controller = require('./requestController');

const healthChecks = [];

function customHealthCheck (fastify, options, next) {
  const { path = '/health', info = undefined, ...rest } = options;

  fastify.decorate('addHealthCheck', (label, fn) =>
    addHealthCheck(label, fn)
  );

  fastify.get(path, rest, (req, res) =>
    Controller(req, res, { healthChecks, info, stats })
  );

  next();
}

async function addHealthCheck (label, fn) {
  healthChecks.push({ label, fn });
}

module.exports = {
  customHealthCheck
};
