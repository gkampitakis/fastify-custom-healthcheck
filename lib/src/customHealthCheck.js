'use strict';

const getStats = require('./stats');
const Controller = require('./requestController');
const schema = require('./health.schema');

function customHealthCheck (fastify, options, next) {
  const { path = '/health', info = undefined, exposeFailure = false, ...rest } = options;
  const healthChecks = [];

  fastify.decorate('addHealthCheck', function (label, fn, evaluation = null) {
    const labelExists = healthChecks.findIndex((h) => (h.label === label)) !== -1;

    if (labelExists) throw Error(`Health check "${label}" already exists`);

    healthChecks.push({ label, fn, evaluation });
  });

  fastify.get(path, { ...rest, schema }, (req, res) =>
    Controller(req, res, { healthChecks, info, stats: getStats(), exposeFailure })
  );

  next();
}

module.exports = {
  customHealthCheck
};
