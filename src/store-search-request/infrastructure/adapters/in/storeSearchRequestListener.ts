import { Job, Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { ConfigService } from "@nestjs/config";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { JobName, QueueName } from "@shared/infrastructure/queue/queueNames";
import { StoreSearchRequestEvent } from "../../../domain/model/storeSearchRequestEvent";
import {
  STORE_SEARCH_REQUEST_PORT,
  StoreSearchRequestUseCase,
} from "../../../domain/ports/in/storeSearchRequestUseCase";

export type QueuedStoreSearchRequest = Omit<StoreSearchRequestEvent, "requestedAt"> & {
  requestedAt: string;
};

@Injectable()
export class StoreSearchRequestListener implements OnModuleInit {
  constructor(
    @InjectQueue(QueueName.STORE_SEARCH_REQUEST) private readonly queue: Queue,
    @Inject(STORE_SEARCH_REQUEST_PORT)
    private readonly storeSearchRequestUseCase: StoreSearchRequestUseCase,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    void this.queue.process(
      JobName.SAVE_STORE_SEARCH_REQUEST,
      this.configService.getOrThrow<number>("STORE_SEARCH_REQUEST_WORKER_CONCURRENCY"),
      (job: Job<QueuedStoreSearchRequest>) => this.handleStoreSearchRequestEvent(job),
    );
  }

  handleStoreSearchRequestEvent(job: Job<QueuedStoreSearchRequest>): Promise<void> {
    return this.storeSearchRequestUseCase.execute({
      ...job.data,
      requestedAt: new Date(job.data.requestedAt),
    });
  }
}
