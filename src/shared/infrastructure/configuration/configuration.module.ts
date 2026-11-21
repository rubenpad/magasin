import z from "zod";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: z.object({
        DATABASE_URL: z.url().nonoptional(),
        DB_POOL_MAX: z.coerce.number().positive().default(20),
        DB_CONNECTION_TIMEOUT_MS: z.coerce.number().int().positive().default(1000),
        DB_STATEMENT_TIMEOUT_MS: z.coerce.number().int().positive().default(1000),
        PORT: z.coerce.number().min(1).max(65535).default(3000),
        MAX_STORE_SEARCH_RADIUS_KM: z.coerce.number().positive().default(10),
        REDIS_HOST: z.string().min(1).default("localhost"),
        REDIS_PORT: z.coerce.number().min(1).max(65535).default(6379),
        AUDIT_PUBLISH_MAX_IN_FLIGHT: z.coerce.number().int().positive().default(1000),
        STORE_SEARCH_REQUEST_WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
      }),
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
