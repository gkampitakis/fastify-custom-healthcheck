export interface addHealthCheck {
  (label: string, fn: (...args: any) => Promise<unknown> | boolean): void;
}
