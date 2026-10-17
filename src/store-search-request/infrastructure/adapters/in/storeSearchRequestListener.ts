import { Job } from "bull";
import { Inject } from "@nestjs/common";
import { Process, Processor } from "@nestjs/bull";
import { JobName, QueueName } from "./queue";
import { StoreSearchRequestEvent } from "../../../domain/model/storeSearchRequestEvent";
import { StoreSearchRequestUseCase } from "../../../domain/ports/in/storeSearchRequestUseCase";
import { STORE_SEARCH_REQUEST_PORT } from "@infrastructure/configuration/findClosestStoreToken";

@Processor(QueueName.STORE_SEARCH_REQUEST)
export class StoreSearchRequestListener {
  constructor(
    @Inject(STORE_SEARCH_REQUEST_PORT)
    private readonly storeSearchRequestUseCase: StoreSearchRequestUseCase,
  ) {}

  @Process(JobName.SAVE_STORE_SEARCH_REQUEST)
  handleStoreSearchRequestEvent(job: Job<StoreSearchRequestEvent>) {
    this.storeSearchRequestUseCase.execute(job.data);
  }
}
