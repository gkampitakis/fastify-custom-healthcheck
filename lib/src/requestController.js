'use strict';

async function Controller (request, reply, payload) {
  const { healthChecks, status } = await computeHealthChecks(
    payload.healthChecks
  );

  reply.status(status).send({
    ...payload,
    healthChecks
  });
}

async function computeHealthChecks (checks) {
  const healthChecks = {};
  let status = 200;

  const promises = Object.values(checks).map(({ fn }) => fn());

  const results = await Promise.allSettled(promises);

  checks.forEach(({ label }, index) => {
    if (results[index].status === 'rejected') {
      healthChecks[label] = 'FAIL';
      status = 500;
      return;
    }
    healthChecks[label] = 'HEALTHY';
  });

  return { healthChecks, status };
}

module.exports = Controller;
