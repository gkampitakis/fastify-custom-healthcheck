const { customHealthCheck } = require('../src/customHealthCheck');
const getSpy = jest.fn();
const decorateSpy = jest.fn();
const fastify = {
  get: (...args) => {
    getSpy(...args);
    args[2]({}, {});
  },
  decorate: decorateSpy
};

jest.mock('../src/stats', () => ({
  mock: 'mockStats'
}));
jest.mock('../src/requestController');

describe('Custom Health Check', () => {
  const ControllerMock = jest.requireMock('../src/requestController');

  beforeEach(() => {
    getSpy.mockClear();
    decorateSpy.mockClear();
    ControllerMock.ControllerSpy.mockClear();
  });

  it('Should create create a decorator', (done) => {
    customHealthCheck(fastify, {}, () => {
      expect(decorateSpy).toHaveBeenCalledWith('addHealthCheck', expect.any(Function));

      done();
    });
  });

  describe('When registering path', () => {
    it('Should add a default path', (done) => {
      customHealthCheck(fastify, { mock: 'option' }, () => {
        expect(getSpy).toHaveBeenCalledWith('/health', { mock: 'option' }, expect.any(Function));

        done();
      });
    });

    it('Should add path provided', (done) => {
      customHealthCheck(fastify, { mock: 'option', path: '/mock/path' }, () => {
        expect(getSpy).toHaveBeenCalledWith('/mock/path', { mock: 'option' }, expect.any(Function));

        done();
      });
    });

    it('Should set controller to get path', (done) => {
      customHealthCheck(fastify, { mock: 'option', info: 'mockInfo' }, () => {
        expect(getSpy).toHaveBeenCalledWith('/health', { mock: 'option' }, expect.any(Function));
        expect(ControllerMock.ControllerSpy).toHaveBeenCalledWith({}, {}, {
          healthChecks: [],
          info: 'mockInfo',
          stats: {
            mock: 'mockStats'
          },
          exposeFailure: false
        });

        done();
      });
    });
  });

  describe('When adding healthcheck', () => {
    it('Should throw error if try to add the same label twice', () => {
      const fastify = {
        get: getSpy,
        decorate: (...args) => {
          decorateSpy(...args);
          args[1]('mockLabel');
          args[1]('mockLabel');
        }
      };

      expect(() => customHealthCheck(fastify, { mock: 'option', info: 'mockInfo' }, jest.fn()))
        .toThrowError('Health check "mockLabel" already exists');
    });
  });
});
