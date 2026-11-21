import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { NoOpenStoreFoundError } from "@domain/exceptions/noOpenStoreFoundError";
import { StoreSearchUnavailableError } from "@domain/exceptions/storeSearchUnavailableError";

@Catch(NoOpenStoreFoundError, StoreSearchUnavailableError)
export class StoreSearchErrorFilter implements ExceptionFilter {
  catch(error: NoOpenStoreFoundError | StoreSearchUnavailableError, host: ArgumentsHost): void {
    const statusCode =
      error instanceof NoOpenStoreFoundError
        ? HttpStatus.NOT_FOUND
        : HttpStatus.SERVICE_UNAVAILABLE;

    host
      .switchToHttp()
      .getResponse<FastifyReply>()
      .status(statusCode)
      .send({ statusCode, message: error.message });
  }
}
