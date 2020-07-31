'use strict';

const stats = require('./stats');
const Controller = require('./requestController');
const PromiseUtil = require('@gkampitakis/promise-util').default;

const healthChecks = {};

function customHealthCheck(fastify, options, next) {
  const {
    path,
    info = undefined,
    healthChecks: checks = [],
    ...rest
  } = options;

  console.log('Reload'); //TODO: for checking npm link work

  constructHealthChecks(checks);

  fastify.get(path ? path : '/health', rest, (req, res) =>
    Controller(req, res, { healthChecks, info, stats })
  );

  next();
}

//HEALTHY,FAIL,TIME_OUT

async function constructHealthChecks(checks) {
  //This might not be needed
  checks.forEach(({ label, fn }) => {
    healthChecks[label] = fn;
  });
}

//TODO: add time out

module.exports = {
  customHealthCheck
};
