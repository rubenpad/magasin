import { Module } from "@nestjs/common";
import { CLOCK_PORT } from "@shared/domain/ports/out/ClockPort";
import { METRICS_PORT } from "@shared/domain/ports/out/MetricsPort";
import { QueueModule } from "@shared/infrastructure/queue/queue.module";
import { MetricsAdapter } from "@shared/infrastructure/adapters/out/MetricsAdapter";
import { SystemClockAdapter } from "@shared/infrastructure/adapters/out/SystemClockAdapter";
import { FindClosestStoreService } from "@domain/service/findClosestStoreService";
import { FIND_CLOSEST_STORE_PORT } from "@domain/ports/in/findClosestStoreUseCase";
import { STORE_REPOSITORY } from "@domain/ports/out/storeRepositoryPort";
import { STORE_SEARCH_REQUEST_PUBLISHER } from "@domain/ports/out/storeSearchRequestPublisherPort";
import { StoresController } from "@infrastructure/adapters/in/http/findClosestStoreController";
import { StoreRepositoryAdapter } from "@infrastructure/adapters/out/persistence/storeRepositoryAdapter";
import { BullStoreSearchRequestPublisher } from "@infrastructure/adapters/out/queue/bullStoreSearchRequestPublisher";

@Module({
  imports: [QueueModule],
  controllers: [StoresController],
  providers: [
    { provide: CLOCK_PORT, useClass: SystemClockAdapter },
    { provide: METRICS_PORT, useClass: MetricsAdapter },
    { provide: STORE_REPOSITORY, useClass: StoreRepositoryAdapter },
    { provide: FIND_CLOSEST_STORE_PORT, useClass: FindClosestStoreService },
    { provide: STORE_SEARCH_REQUEST_PUBLISHER, useClass: BullStoreSearchRequestPublisher },
  ],
})
export class FindClosestStoreModule {}
