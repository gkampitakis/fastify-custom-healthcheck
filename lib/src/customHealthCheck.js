'use strict';

const getStats = require('./stats');
const Controller = require('./requestController');
const schema = require('./health.schema');

function resolveSchema (options) {
  if (options.schema === false) {
    return undefined;
  }

  if (options.schema === true || options.schema === undefined || options.schema === null) {
    return schema;
  }

  return options.schema;
}

function customHealthCheck (fastify, options, next) {
  const { path = '/health', hideResponse = false, info = undefined, exposeFailure = false, ...rest } = options;
  const healthChecks = [];

  fastify.decorate('addHealthCheck', function (label, fn, evaluation = null) {
    const labelExists = healthChecks.findIndex((h) => (h.label === label)) !== -1;

    if (labelExists) throw Error(`Health check "${label}" already exists`);

    healthChecks.push({ label, fn, evaluation });
  });

  const resolvedSchema = resolveSchema(options);
  fastify.get(path, { ...rest, logLevel: (hideResponse === false) ? 'info' : 'silent', schema: resolvedSchema }, (req, res) =>
    Controller(req, res, { healthChecks, info, stats: getStats(), exposeFailure })
  );

  next();
}

module.exports = {
  customHealthCheck
};
