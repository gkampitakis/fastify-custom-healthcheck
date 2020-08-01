'use strict';

const creationTime = new Date().toISOString();
const memory = process.memoryUsage();
const _package = require(`${process.cwd()}/package.json`);

const stats = {
  creationTime,
  uptime: process.uptime(),
  memory: { ...memory },
  ...(process.env.NODE_ENV && { env: process.env.NODE_ENV }),
  ...(_package.name && { name: _package.name }),
  ...(_package.version && { version: _package.version }),
  node: process.version
};

module.exports = stats;
