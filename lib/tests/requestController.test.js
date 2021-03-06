const requestController = require('../src/requestController');

describe('Request Controller', () => {
  const request = null;
  const sendSpy = jest.fn();
  const reply = {
    status: jest.fn(() => ({
      send: sendSpy
    }))
  };

  beforeEach(() => {
    sendSpy.mockClear();
    reply.status.mockClear();
  });

  it('Should compute health checks and return 200 status', async () => {
    const payload = {
      info: { mock: 'payload' },
      stats: { mock: 'stats' },
      healthChecks: [{ label: 'test', fn: () => true }, { label: 'test2', fn: () => true }]
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(sendSpy).toHaveBeenCalledWith({
      info: { mock: 'payload' },
      healthChecks: {
        test: 'HEALTHY',
        test2: 'HEALTHY'
      },
      stats: { mock: 'stats' }
    });
  });

  it('Should compute health checks and return 500 status', async () => {
    const payload = {
      info: { mock: 'payload' },
      stats: { mock: 'stats' },
      healthChecks: [{ label: 'test', fn: () => Promise.reject(new Error('Error')) }, { label: 'test2', fn: () => true }]
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(500);
    expect(sendSpy).toHaveBeenCalledWith({
      info: { mock: 'payload' },
      healthChecks: {
        test: 'FAIL',
        test2: 'HEALTHY'
      },
      stats: { mock: 'stats' }
    });
  });

  it('Should compute health checks, return 500 status and expose reason of failure', async () => {
    const payload = {
      stats: {},
      exposeFailure: true,
      healthChecks: [{ label: 'test', fn: () => Promise.reject(new Error('Mock Error')) }, { label: 'test2', fn: () => true }]
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(500);
    expect(sendSpy).toHaveBeenCalledWith({
      stats: {},
      healthChecks: {
        test: {
          status: 'FAIL',
          reason: 'Error: Mock Error'
        },
        test2: 'HEALTHY'
      }
    });
  });

  it('Should compute health check and fail cause of evaluation', async () => {
    const payload = {
      stats: {},
      exposeFailure: true,
      healthChecks: [{ label: 'test', fn: () => false, evaluation: { value: true } }, { label: 'test2', fn: () => true }]
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(500);
    expect(sendSpy).toHaveBeenCalledWith({
      stats: {},
      healthChecks: {
        test: {
          status: 'FAIL',
          reason: 'Evaluation "true" failed'
        },
        test2: 'HEALTHY'
      }
    });
  });

  it('Should compute health check,fail and hide error', async () => {
    const payload = {
      stats: {},
      exposeFailure: false,
      healthChecks: [{ label: 'test', fn: () => false, evaluation: { value: true } }, { label: 'test2', fn: () => true }]
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(500);
    expect(sendSpy).toHaveBeenCalledWith({
      stats: {},
      healthChecks: {
        test: 'FAIL',
        test2: 'HEALTHY'
      }
    });
  });

  it('Should compute health check and use complex evaluation', async () => {
    const payload = {
      stats: {},
      exposeFailure: true,
      healthChecks: [{ label: 'test', fn: () => ({ some: { nested: { value: 'mock' } } }), evaluation: { value: { some: { nested: { value: 'mock' } } } } }, { label: 'test2', fn: () => true }]
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(sendSpy).toHaveBeenCalledWith({
      stats: {},
      healthChecks: {
        test: 'HEALTHY',
        test2: 'HEALTHY'
      }
    });
  });

  it('Should not return healthChecks field if no checks are provided', async () => {
    const payload = {
      stats: {},
      exposeFailure: true,
      healthChecks: []
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(sendSpy).toHaveBeenCalledWith({
      stats: {}
    });
  });
});
