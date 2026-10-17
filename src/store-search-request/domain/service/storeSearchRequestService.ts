import { Inject, Injectable, Logger } from "@nestjs/common";
import { StoreSearchRequestEvent } from "../model/storeSearchRequestEvent";
import { StoreSearchRequestUseCase } from "../ports/in/storeSearchRequestUseCase";
import { STORE_SEARCH_REQUEST_REPOSITORY } from "@infrastructure/configuration/findClosestStoreToken";
import { StoreSearchRequestRepositoryPort } from "../ports/out/storeSearchRequestRepositoryPort";

@Injectable()
export class StoreSearchRequestService implements StoreSearchRequestUseCase {
  private readonly logger = new Logger(StoreSearchRequestService.name);

  constructor(
    @Inject(STORE_SEARCH_REQUEST_REPOSITORY)
    private readonly storeSearchRequestRepositoryPort: StoreSearchRequestRepositoryPort,
  ) {}

  async execute(storeSearchRequestEvent: StoreSearchRequestEvent) {
    this.logger.log("Processing search store request event started");
    try {
      await this.storeSearchRequestRepositoryPort.save(storeSearchRequestEvent);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to persist store search audit ${message}`);
    }

    this.logger.log("Processing search store request event completed");
  }
}
