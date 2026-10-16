import z from "zod";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: z.object({
        DATABASE_URL: z.url().nonoptional(),
        PORT: z.coerce.number().int().min(1).max(65535).default(3000),
        MAX_STORE_SEARCH_RADIUS_KM: z.coerce.number().positive().default(10),
      }),
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
