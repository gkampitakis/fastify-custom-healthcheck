'use strict';

const creationTime = new Date().toISOString();
const memory = process.memoryUsage();

const stats = {
  creationTime,
  uptime: process.uptime(),
  memory: { ...memory }
};

module.exports = stats;
