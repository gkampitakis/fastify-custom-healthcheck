describe('Stats', () => {
  const mockDate = new Date();
  const mockMemoryUsage = {
    external: 10,
    heapTotal: 10,
    heapUsed: 10,
    rss: 10
  };
  const mockCpuUsage = {
    user: 0,
    system: 0
  };

  jest.spyOn(global, 'Date')
    .mockImplementation(() => mockDate);

  jest.spyOn(process, 'memoryUsage')
    .mockImplementation(() => mockMemoryUsage);

  jest.spyOn(process, 'uptime')
    .mockImplementation(() => 10);
  it('Should return stats object', () => {
    const getStats = require('../src/stats');

    expect(getStats()).toEqual({
      creationTime: mockDate.toISOString(),
      uptime: 10,
      memory: {
        ...(mockMemoryUsage)
      },
      cpu: {
        ...(mockCpuUsage)
      }
    });
  });
});
