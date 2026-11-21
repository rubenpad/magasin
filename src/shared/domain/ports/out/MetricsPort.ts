export const METRICS_PORT = Symbol("METRICS_PORT");

export interface MetricsPort {
  increment(metricName: string, count: number, labels?: Record<string, string>): void;
  observe(metricName: string, value: number, labels?: Record<string, string>): void;
}
