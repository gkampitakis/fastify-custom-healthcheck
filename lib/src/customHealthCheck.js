'use strict';

const stats = require('./stats');
const Controller = require('./requestController');

const healthChecks = [];

function customHealthCheck(fastify, options, next) {
  const { path, info = undefined, ...rest } = options;

  console.log('Reload'); //TODO: for checking npm link work

  fastify.decorate('addHealthCheck', (label, fn, timeout = 0) =>
    //TODO: handle wrong params here
    addHealthCheck(label, fn, timeout)
  );

  fastify.get(path ? path : '/health', rest, (req, res) =>
    Controller(req, res, { healthChecks, info, stats })
  );

  next();
}

async function addHealthCheck(label, fn, timeout = 0) {
  healthChecks.push({ label, fn, timeout });
}

module.exports = {
  customHealthCheck
};
