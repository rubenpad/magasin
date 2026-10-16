import { Injectable } from "@nestjs/common";
import { TracerService } from "@nestjs/observe";
import { MetricsPort } from "@shared/domain/ports/out/MetricsPort";

@Injectable()
export class MetricsAdapter implements MetricsPort {
  constructor(private readonly tracerService: TracerService) {}

  increment(metricName: string, count: number, labels: Record<string, string> = {}): void {
    const labelsKeys = Object.keys(labels);

    if (labelsKeys.length === 0) {
      this.tracerService.counter(metricName).increment(count);
      return;
    }

    this.tracerService.counter(metricName, { labels: labelsKeys }).increment(labels, count);
  }

  observe(metricName: string, value: number, labels: Record<string, string> = {}): void {
    const label = Object.entries(labels)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`)
      .join(",");

    const summary = this.tracerService.summary<string>(metricName);
    if (label) {
      summary.observe(value, label);
      return;
    }

    summary.observe(value);
  }
}
