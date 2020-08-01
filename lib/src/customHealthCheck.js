'use strict';

const stats = require('./stats');
const Controller = require('./requestController');

const healthChecks = [];

function customHealthCheck (fastify, options, next) {
  const { path = '/health', info = undefined, exposeFailure = false, ...rest } = options;

  fastify.decorate('addHealthCheck', (label, fn) =>
    addHealthCheck(label, fn)
  );

  fastify.get(path, rest, (req, res) =>
    Controller(req, res, { healthChecks, info, stats, exposeFailure })
  );

  next();
}

function addHealthCheck (label, fn) {
  if (labelExists(label)) throw Error(`Health check "${label}" already exists`);

  healthChecks.push({ label, fn });
}

function labelExists (_label) {
  return healthChecks.findIndex(({ label }) => (label === _label)) !== -1;
}

module.exports = {
  customHealthCheck
};
