import { Inject, Injectable, Logger } from "@nestjs/common";
import { StoreSearchRequestEvent } from "../model/storeSearchRequestEvent";
import { StoreSearchRequestUseCase } from "../ports/in/storeSearchRequestUseCase";
import {
  STORE_SEARCH_REQUEST_REPOSITORY,
  StoreSearchRequestRepositoryPort,
} from "../ports/out/storeSearchRequestRepositoryPort";

@Injectable()
export class StoreSearchRequestService implements StoreSearchRequestUseCase {
  private readonly logger = new Logger(StoreSearchRequestService.name);

  constructor(
    @Inject(STORE_SEARCH_REQUEST_REPOSITORY)
    private readonly storeSearchRequestRepositoryPort: StoreSearchRequestRepositoryPort,
  ) {}

  async execute(storeSearchRequestEvent: StoreSearchRequestEvent): Promise<void> {
    try {
      await this.storeSearchRequestRepositoryPort.save(storeSearchRequestEvent);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to persist store search request ${storeSearchRequestEvent.requestId}: ${message}`,
      );
      throw error;
    }
  }
}
