import { Logger } from "nestjs-pino";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { StandardSchemaValidationPipe } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { AppModule } from "./app.module";
import { ObserveInstrument } from "@shared/infrastructure/configuration/observe.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
    instrument: ObserveInstrument,
  });

  const port = app.get(ConfigService).getOrThrow<number>("PORT");
  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new StandardSchemaValidationPipe());

  await app.listen(port, "0.0.0.0");

  console.log(`InstaStore is running on ${await app.getUrl()}`);
}

void bootstrap();
