describe('Stats', () => {
  const mockDate = new Date();
  const mockMemoryUsage = {
    external: 10,
    heapTotal: 10,
    heapUsed: 10,
    rss: 10
  };

  jest.spyOn(global, 'Date')
    .mockImplementation(() => mockDate);

  jest.spyOn(process, 'memoryUsage')
    .mockImplementation(() => mockMemoryUsage);

  jest.spyOn(process, 'uptime')
    .mockImplementation(() => 10);
  it('Should return stats object', () => {
    const stats = require('../src/stats');

    expect(stats).toEqual({
      creationTime: mockDate.toISOString(),
      uptime: 10,
      memory: {
        ...(mockMemoryUsage)
      }
    });
  });
});
