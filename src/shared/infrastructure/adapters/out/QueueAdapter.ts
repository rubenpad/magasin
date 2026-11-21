import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { QueuePort } from "@shared/domain/ports/out/QueuePort";
import { QueueName } from "../../../../store-search-request/infrastructure/adapters/in/queue";

@Injectable()
export class QueueAdapter implements QueuePort {
  constructor(@InjectQueue(QueueName.STORE_SEARCH_REQUEST) private readonly queue: Queue) {}

  async add<T>(jobName: string, data: T): Promise<void> {
    await this.queue.add(jobName, data);
  }
}
