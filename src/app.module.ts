import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { TerminusModule } from "@nestjs/terminus";
import { BullModule } from "@nestjs/bull";
import { FindClosestStoreService } from "@domain/service/findClosestStoreService";
import { StoresController } from "@infrastructure/adapters/in/http/findClosestStoreController";
import { StoreRepositoryAdapter } from "@infrastructure/adapters/out/persistence/storeRepositoryAdapter";
import { StoreSearchRequestAuditRepositoryAdapter } from "./store-search-request/infrastructure/adapters/out/persistence/storeSearchRequestRepositoryAdapter";
import {
  STORE_REPOSITORY,
  FIND_CLOSEST_STORE_PORT,
  STORE_SEARCH_REQUEST_PORT,
  STORE_SEARCH_REQUEST_REPOSITORY,
  QUEUE_PORT,
} from "@infrastructure/configuration/findClosestStoreToken";
import { QueueAdapter } from "@shared/infrastructure/adapters/out/QueueAdapter";
import { METRICS_PORT } from "@infrastructure/configuration/findClosestStoreToken";
import { ObserveModule } from "@shared/infrastructure/configuration/observe.module";
import { MetricsAdapter } from "@shared/infrastructure/adapters/out/MetricsAdapter";
import { QueueName } from "./store-search-request/infrastructure/adapters/in/queue";
import { DatabaseModule } from "@shared/infrastructure/configuration/database.module";
import { HealthController } from "@shared/infrastructure/adapters/in/health/healthController";
import { ConfigurationModule } from "@shared/infrastructure/configuration/configuration.module";
import { StoreSearchRequestService } from "./store-search-request/domain/service/storeSearchRequestService";
import { StoreSearchRequestListener } from "./store-search-request/infrastructure/adapters/in/storeSearchRequestListener";

@Module({
  imports: [
    ObserveModule.forRoot({
      runtimeMetrics: true,
      runtimeMetricsInterval: 30000,
      serviceId: "instastore",
      appKey: process.env.OBSERVE_APP_KEY as string,
      appSecret: process.env.OBSERVE_APP_SECRET as string,
    }),
    LoggerModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST ?? "localhost",
        port: parseInt(process.env.REDIS_PORT ?? "6379"),
      },
    }),
    BullModule.registerQueue({ name: QueueName.STORE_SEARCH_REQUEST }),
    ConfigurationModule,
    DatabaseModule,
    TerminusModule,
  ],
  controllers: [HealthController, StoresController],
  providers: [
    QueueAdapter,
    MetricsAdapter,
    StoreRepositoryAdapter,
    FindClosestStoreService,
    StoreSearchRequestService,
    StoreSearchRequestListener,
    StoreSearchRequestAuditRepositoryAdapter,
    {
      provide: QUEUE_PORT,
      useExisting: QueueAdapter,
    },
    {
      provide: METRICS_PORT,
      useExisting: MetricsAdapter,
    },
    {
      provide: FIND_CLOSEST_STORE_PORT,
      useExisting: FindClosestStoreService,
    },
    {
      provide: STORE_REPOSITORY,
      useExisting: StoreRepositoryAdapter,
    },
    {
      provide: STORE_SEARCH_REQUEST_PORT,
      useExisting: StoreSearchRequestService,
    },
    {
      provide: STORE_SEARCH_REQUEST_REPOSITORY,
      useExisting: StoreSearchRequestAuditRepositoryAdapter,
    },
  ],
})
export class AppModule {}
