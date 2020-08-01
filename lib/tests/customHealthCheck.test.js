const { customHealthCheck } = require('../src/customHealthCheck');
const getSpy = jest.fn();
const decorateSpy = jest.fn();
const fastify = {
  get: getSpy,
  decorate: decorateSpy
};

jest.mock('../src/stats', () => ({
  mock: 'mockStats'
}));

describe('Custom Health Check', () => {
  beforeEach(() => {
    getSpy.mockClear();
    decorateSpy.mockClear();
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
  });
});
