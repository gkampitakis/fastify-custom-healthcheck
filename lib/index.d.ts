import {
  FastifyPluginCallback
} from "fastify";
import { addHealthCheck } from './src/customHealthCheck';

export interface CustomHealthCheckOptions {
  /** Path where health route is registered */
  path?: string;
  /** Object where you can define custom information you would like to include in healthcheck response */
  info?: Record<string, string>;
  /** Flag that enables additional information
   * to be presented in a health check object when a check fails. */
  exposeFailure?: boolean;
  /** If set to true, default schema is used for the route definition,
   * if to false - no schema.
   * If an object is passed, it will be used as a schema.
   * The Default value is "true" */
  schema?: boolean | Record<string, any>
  /** If set to true, when your system gets hit with the path,
   * fastify is not going to log that it was hit.
   * This makes the logs cleaner, but also eliminates any logs generated.
   * It has no bearing on the response of the plugin, however. */
  hideResponse?: boolean;
}

declare module 'fastify' {
  interface FastifyInstance {
    addHealthCheck: addHealthCheck;
  }
}

declare const customHealthCheck: FastifyPluginCallback<CustomHealthCheckOptions>;
export default customHealthCheck;
