const equal = require('fast-deep-equal');
const PromisesExtensions = require('promises-extension');

async function Controller (request, reply, payload) {
  const { stats, info, exposeFailure } = payload;
  const { healthChecks, status } = await computeHealthChecks(
    payload.healthChecks,
    exposeFailure
  );

  reply.status(status).send({
    ...(Object.keys(healthChecks).length) && { healthChecks },
    stats,
    ...(info && { info })
  });
}

async function computeHealthChecks (checks, exposeFailure) {
  const healthChecks = {};
  let status = 200;

  const promises = Object.values(checks).map(({ fn }) => fn());

  const results = await PromisesExtensions.allSettled(promises);

  checks.forEach(({ label, evaluation }, index) => {
    if (results[index].status === 'rejected') {
      healthChecks[label] = exposeFailure ? { status: 'FAIL', reason: `${results[index].reason}` } : 'FAIL';
      status = 500;
      return;
    }

    if (evaluation && !equal(evaluation.value, results[index].value)) {
      healthChecks[label] = exposeFailure ? { status: 'FAIL', reason: `Evaluation "${JSON.stringify(evaluation.value)}" failed` } : 'FAIL';
      status = 500;
      return;
    }
    healthChecks[label] = 'HEALTHY';
  });

  return { healthChecks, status };
}

module.exports = Controller;
