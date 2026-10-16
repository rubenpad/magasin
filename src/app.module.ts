import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { FindClosestStoreService } from "@domain/service/findClosestStoreService";
import { StoresController } from "@infrastructure/adapters/in/http/findClosestStoreController";
import { StoreRepositoryAdapter } from "@infrastructure/adapters/out/persistence/storeRepositoryAdapter";
import {
  FIND_CLOSEST_STORE_PORT,
  STORE_REPOSITORY,
} from "@infrastructure/configuration/findClosestStoreToken";
import { HealthController } from "@shared/infrastructure/adapters/in/health/healthController";
import { DatabaseModule } from "@shared/infrastructure/configuration/database.module";
import { ConfigurationModule } from "@shared/infrastructure/configuration/configuration.module";

@Module({
  imports: [ConfigurationModule, DatabaseModule, TerminusModule],
  controllers: [HealthController, StoresController],
  providers: [
    FindClosestStoreService,
    StoreRepositoryAdapter,
    {
      provide: FIND_CLOSEST_STORE_PORT,
      useExisting: FindClosestStoreService,
    },
    {
      provide: STORE_REPOSITORY,
      useExisting: StoreRepositoryAdapter,
    },
  ],
})
export class AppModule {}
