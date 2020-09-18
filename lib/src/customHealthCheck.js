'use strict';

const getStats = require('./stats');
const Controller = require('./requestController');

const healthChecks = [];

function customHealthCheck (fastify, options, next) {
  const { path = '/health', info = undefined, exposeFailure = false, ...rest } = options;

  fastify.decorate('addHealthCheck', addHealthCheck);

  fastify.get(path, rest, (req, res) =>
    Controller(req, res, { healthChecks, info, stats: getStats(), exposeFailure })
  );

  next();
}

function addHealthCheck (label, fn, evaluation = null) {
  if (labelExists(label)) throw Error(`Health check "${label}" already exists`);

  healthChecks.push({ label, fn, evaluation });
}

function labelExists (_label) {
  return healthChecks.findIndex(({ label }) => (label === _label)) !== -1;
}

module.exports = {
  customHealthCheck
};
