'use strict';
const fp = require('fastify-plugin');
const { customHealthCheck } = require('./src/customHealthCheck');

module.exports = fp(customHealthCheck, '3.x');
