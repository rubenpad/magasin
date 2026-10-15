import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { FIND_CLOSEST_STORE_PORT } from './find-closest-store/infrastructure/configuration/findClosestStoreToken';
import { StoresController } from './find-closest-store/infrastructure/adapters/in/http/findClosestStoreController';
import { HealthController } from './shared/infrastructure/adapters/in/health/healthController';
import { DatabaseModule } from './shared/infrastructure/adapters/out/postgres/database.module';
import { ConfigurationModule } from './shared/infrastructure/configuration/configuration.module';
import { FindClosestStoreService } from './find-closest-store/domain/service/findClosestStoreService';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    TerminusModule,
  ],
  controllers: [HealthController, StoresController],
  providers: [
    FindClosestStoreService,
    {
      provide: FIND_CLOSEST_STORE_PORT,
      useExisting: FindClosestStoreService,
    },
  ],
})
export class AppModule {}
