export interface addHealthCheck {
  /**  Decorator for adding custom health checks functions
   * @param label string for registering checks, must be unique
   * @param fn callback function supports Promises
   * @param evaluation object containing a value to compare with healthcheck fn return value
   */
  (
    label: string,
    fn: (...args: any) => Promise<unknown> | unknown,
    evaluation?: evaluation
  ): void;
}

interface evaluation {
  /** object or value to compare with healthcheck fn */
  value: unknown;
}
