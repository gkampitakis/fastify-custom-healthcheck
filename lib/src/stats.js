'use strict';

const creationTime = new Date().toISOString();

const getStats = () => ({
  creationTime,
  uptime: process.uptime(),
  memory: { ...process.memoryUsage() }
});

module.exports = getStats;
