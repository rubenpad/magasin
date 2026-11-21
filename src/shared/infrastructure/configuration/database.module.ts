import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { StoreEntity } from "@infrastructure/adapters/out/persistence/entities/storeEntity";
import { StoreScheduleEntity } from "@infrastructure/adapters/out/persistence/entities/storeScheduleEntity";
import { StoreSearchRequestEntity } from "../../../store-search-request/infrastructure/adapters/out/persistence/entities/storeSearchRequestEntity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: "postgres",
        url: configService.getOrThrow<string>("DATABASE_URL"),
        poolSize: configService.getOrThrow<number>("DB_POOL_MAX"),
        connectTimeoutMS: configService.getOrThrow<number>("DB_CONNECTION_TIMEOUT_MS"),
        extra: {
          statement_timeout: configService.getOrThrow<number>("DB_STATEMENT_TIMEOUT_MS"),
        },
        entities: [StoreEntity, StoreScheduleEntity, StoreSearchRequestEntity],
        migrations: [__dirname + "/migrations/*{.js,.ts}"],
        synchronize: false,
        migrationsRun: false,
        installExtensions: false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
