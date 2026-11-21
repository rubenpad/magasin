import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { DatabaseModule } from "@shared/infrastructure/configuration/database.module";
import { ConfigurationModule } from "@shared/infrastructure/configuration/configuration.module";
import { StoreSearchRequestModule } from "./store-search-request/storeSearchRequest.module";

@Module({
  imports: [LoggerModule.forRoot(), ConfigurationModule, DatabaseModule, StoreSearchRequestModule],
})
export class WorkerModule {}
