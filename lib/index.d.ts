import { FastifyPlugin } from 'fastify';
import { addHealthCheck } from './src/customHealthCheck';

export interface CustomHealthCheckOptions {
  /** Path where health route is registered */
  path?: string;
  /** Object where you can define custom information you would like to include in healthcheck response */
  info?: Record<string, string>;
  /** Flag that enables additional information to be presented in health check object when a check fails. */
  exposeFailure?: boolean;
}

declare module 'fastify' {
  interface FastifyInstance {
    addHealthCheck: addHealthCheck;
  }
}

declare const customHealthCheck: FastifyPlugin<CustomHealthCheckOptions>;
export default customHealthCheck;
