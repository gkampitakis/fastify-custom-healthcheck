export interface addHealthCheck {
  (label: string, fn: (...args: any) => Promise<unknown> | unknown, evaluation?: evaluation): void;
}

interface evaluation {
  evaluation: boolean
}