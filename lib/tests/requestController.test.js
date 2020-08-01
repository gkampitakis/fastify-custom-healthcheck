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
      mock: 'payload',
      healthChecks: [{ label: 'test', fn: () => true }, { label: 'test2', fn: () => true }]
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(sendSpy).toHaveBeenCalledWith({
      mock: 'payload',
      healthChecks: {
        test: 'HEALTHY',
        test2: 'HEALTHY'
      }
    });
  });

  it('Should compute health checks and return 500 status', async () => {
    const payload = {
      mock: 'payload',
      healthChecks: [{ label: 'test', fn: () => Promise.reject(new Error('Error')) }, { label: 'test2', fn: () => true }]
    };

    await requestController(request, reply, payload);
    expect(reply.status).toHaveBeenCalledWith(500);
    expect(sendSpy).toHaveBeenCalledWith({
      mock: 'payload',
      healthChecks: {
        test: 'FAIL',
        test2: 'HEALTHY'
      }
    });
  });
});
