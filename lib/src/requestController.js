'use strict';

const { check } = require('prettier');

const PromiseUtil = require('@gkampitakis/promise-util').default;

async function Controller(request, reply, payload) {
  const status = 200;

  const healthChecks = await computeHealthChecks(payload.healthChecks);

  // try {
  //   const data = await PromiseUtil.delay(5000, () => Promise.reject('error'));

  //   console.log(data);
  // } catch (error) {
  //   console.log(error);
  // }

  reply.status(status).send({
    ...payload,
    healthChecks
  });
}

async function computeHealthChecks(checks) {
  const response = {};

  for await (const key of Object.keys(checks)) {
    try {
      await checks[key]();

      response[key] = 'HEALTHY';
    } catch (error) {
      console.log(error);
      response[key] = 'FAIL';
    }
  }

  return response;
}

module.exports = Controller;
