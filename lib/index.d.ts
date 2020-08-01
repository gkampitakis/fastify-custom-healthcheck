import { FastifyPlugin } from 'fastify';
import { addHealthCheck } from './src/customHealthCheck';

export interface CustomHealthCheckOptions {
  path?: string;
  info?: Record<string, string>;
  exposeFailure?: boolean;
}

declare module 'fastify' {
  interface FastifyInstance {
    addHealthCheck: addHealthCheck;
  }
}

declare const customHealthCheck: FastifyPlugin<CustomHealthCheckOptions>;
export default customHealthCheck;
