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
  // TODO: add support for same keys error or invalid key , add support for for boolean evaluation and flag
  const healthChecks = {};
  let status = 200;

  const promises = Object.values(checks).map(({ fn }) => fn());

  const results = await Promise.allSettled(promises);

  checks.forEach(({ label }, index) => {
    console.log(label, index);
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
