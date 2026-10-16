import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { TerminusModule } from "@nestjs/terminus";
import { FindClosestStoreService } from "@domain/service/findClosestStoreService";
import { StoresController } from "@infrastructure/adapters/in/http/findClosestStoreController";
import { StoreRepositoryAdapter } from "@infrastructure/adapters/out/persistence/storeRepositoryAdapter";
import { StoreSearchRequestAuditRepositoryAdapter } from "@infrastructure/adapters/out/persistence/storeSearchRequestAuditRepositoryAdapter";
import {
  FIND_CLOSEST_STORE_PORT,
  STORE_REPOSITORY,
  STORE_SEARCH_REQUEST_AUDIT_REPOSITORY,
} from "@infrastructure/configuration/findClosestStoreToken";
import { HealthController } from "@shared/infrastructure/adapters/in/health/healthController";
import { DatabaseModule } from "@shared/infrastructure/configuration/database.module";
import { ConfigurationModule } from "@shared/infrastructure/configuration/configuration.module";
import { ObserveModule } from "@shared/infrastructure/configuration/observe.module";

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
    ConfigurationModule,
    DatabaseModule,
    TerminusModule,
  ],
  controllers: [HealthController, StoresController],
  providers: [
    FindClosestStoreService,
    StoreRepositoryAdapter,
    StoreSearchRequestAuditRepositoryAdapter,
    {
      provide: FIND_CLOSEST_STORE_PORT,
      useExisting: FindClosestStoreService,
    },
    {
      provide: STORE_REPOSITORY,
      useExisting: StoreRepositoryAdapter,
    },
    {
      provide: STORE_SEARCH_REQUEST_AUDIT_REPOSITORY,
      useExisting: StoreSearchRequestAuditRepositoryAdapter,
    },
  ],
})
export class AppModule {}
