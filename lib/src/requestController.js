'use strict';

async function Controller (request, reply, payload) {
  const { stats, info, exposeFailure } = payload;
  const { healthChecks, status } = await computeHealthChecks(
    payload.healthChecks,
    exposeFailure
  );

  reply.status(status).send({
    healthChecks,
    stats,
    ...(info && { info })
  });
}

async function computeHealthChecks (checks, exposeFailure) {
  const healthChecks = {};
  let status = 200;

  const promises = Object.values(checks).map(({ fn }) => fn());

  const results = await Promise.allSettled(promises);

  checks.forEach(({ label }, index) => {
    if (results[index].status === 'rejected') {
      healthChecks[label] = exposeFailure ? { status: 'FAIL', reason: `${results[index].reason}` } : 'FAIL';
      status = 500;
      return;
    }
    healthChecks[label] = 'HEALTHY';
  });

  return { healthChecks, status };
}

module.exports = Controller;
