import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { JobName, QueueName } from "@shared/infrastructure/queue/queueNames";
import { StoreSearchRequestPublisherPort } from "@domain/ports/out/storeSearchRequestPublisherPort";
import { StoreSearchRequestEvent } from "../../../../../store-search-request/domain/model/storeSearchRequestEvent";

export class PublishRejectedError extends Error {}

@Injectable()
export class BullStoreSearchRequestPublisher implements StoreSearchRequestPublisherPort {
  private inFlight = 0;
  private readonly maxInFlight: number;

  constructor(
    @InjectQueue(QueueName.STORE_SEARCH_REQUEST) private readonly queue: Queue,
    configService: ConfigService,
  ) {
    this.maxInFlight = configService.getOrThrow<number>("AUDIT_PUBLISH_MAX_IN_FLIGHT");
  }

  async publish(event: StoreSearchRequestEvent): Promise<void> {
    if (this.inFlight >= this.maxInFlight) {
      throw new PublishRejectedError(`Publish backlog is full (${this.maxInFlight} in flight)`);
    }

    this.inFlight++;
    try {
      await this.queue.add(JobName.SAVE_STORE_SEARCH_REQUEST, event, { jobId: event.requestId });
    } finally {
      this.inFlight--;
    }
  }
}
