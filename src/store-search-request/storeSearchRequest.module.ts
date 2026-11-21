import { Module } from "@nestjs/common";
import { QueueModule } from "@shared/infrastructure/queue/queue.module";
import { StoreSearchRequestService } from "./domain/service/storeSearchRequestService";
import { STORE_SEARCH_REQUEST_PORT } from "./domain/ports/in/storeSearchRequestUseCase";
import { STORE_SEARCH_REQUEST_REPOSITORY } from "./domain/ports/out/storeSearchRequestRepositoryPort";
import { StoreSearchRequestListener } from "./infrastructure/adapters/in/storeSearchRequestListener";
import { StoreSearchRequestAuditRepositoryAdapter } from "./infrastructure/adapters/out/persistence/storeSearchRequestRepositoryAdapter";

@Module({
  imports: [QueueModule],
  providers: [
    StoreSearchRequestListener,
    { provide: STORE_SEARCH_REQUEST_PORT, useClass: StoreSearchRequestService },
    {
      provide: STORE_SEARCH_REQUEST_REPOSITORY,
      useClass: StoreSearchRequestAuditRepositoryAdapter,
    },
  ],
})
export class StoreSearchRequestModule {}
