'use strict';

const creationTime = new Date().toISOString();

const getStats = () => ({
  creationTime,
  uptime: process.uptime(),
  memory: { ...process.memoryUsage() },
  cpu: { ...process.cpuUsage() }
});

module.exports = getStats;
