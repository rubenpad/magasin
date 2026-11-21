import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { TerminusModule } from "@nestjs/terminus";
import { ObserveModule } from "@shared/infrastructure/configuration/observe.module";
import { DatabaseModule } from "@shared/infrastructure/configuration/database.module";
import { HealthController } from "@shared/infrastructure/adapters/in/health/healthController";
import { ConfigurationModule } from "@shared/infrastructure/configuration/configuration.module";
import { FindClosestStoreModule } from "./find-closest-store/findClosestStore.module";

@Module({
  imports: [
    ObserveModule.forRoot({
      runtimeMetrics: true,
      runtimeMetricsInterval: 30000,
      serviceId: "magasin",
      appKey: process.env.OBSERVE_APP_KEY as string,
      appSecret: process.env.OBSERVE_APP_SECRET as string,
    }),
    LoggerModule.forRoot(),
    ConfigurationModule,
    DatabaseModule,
    TerminusModule,
    FindClosestStoreModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
