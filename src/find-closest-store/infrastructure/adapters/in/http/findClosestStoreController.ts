import { Controller, Get, Inject, Query, UseFilters } from "@nestjs/common";
import { Objective } from "@nestjs/observe";
import { ClosestOpenStore } from "@domain/model/closestOpenStore";
import {
  FIND_CLOSEST_STORE_PORT,
  FindClosestStoreUseCase,
} from "@domain/ports/in/findClosestStoreUseCase";
import { FindClosestStoreQuery, findClosestStoreQuerySchema } from "./dto/findClosestStoreQuery";
import { StoreSearchErrorFilter } from "./storeSearchErrorFilter";

@Controller("v1/stores")
@UseFilters(StoreSearchErrorFilter)
export class StoresController {
  constructor(
    @Inject(FIND_CLOSEST_STORE_PORT)
    private readonly findClosestStore: FindClosestStoreUseCase,
  ) {}

  @Get("closest")
  @Objective({ availability: 99.9, latency: { underMs: 300, target: 95 } })
  findClosest(
    @Query({ schema: findClosestStoreQuerySchema })
    query: FindClosestStoreQuery,
  ): Promise<ClosestOpenStore> {
    return this.findClosestStore.execute(query.latitude, query.longitude);
  }
}
