import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ClosestOpenStore } from "@domain/model/closestOpenStore";
import { FindClosestStoreUseCase } from "@domain/ports/in/findClosestStoreUseCase";
import { FIND_CLOSEST_STORE_PORT } from "@infrastructure/configuration/findClosestStoreToken";
import { FindClosestStoreQuery, findClosestStoreQuerySchema } from "./dto/findClosestStoreQuery";

@Controller("v1/stores")
export class StoresController {
  constructor(
    @Inject(FIND_CLOSEST_STORE_PORT)
    private readonly findClosestStore: FindClosestStoreUseCase,
  ) {}

  @Get("closest")
  findClosest(
    @Query({ schema: findClosestStoreQuerySchema })
    query: FindClosestStoreQuery,
  ): Promise<ClosestOpenStore> {
    return this.findClosestStore.execute(query.latitude, query.longitude);
  }
}
