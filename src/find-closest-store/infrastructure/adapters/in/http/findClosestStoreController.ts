import { Controller, Get, Inject } from "@nestjs/common";
import { FIND_CLOSEST_STORE_PORT } from "../../../configuration/findClosestStoreToken";
import { FindClosestStoreUseCase } from "../../../../domain/ports/in/findClosestStoreUseCase";
import { Store } from "../../../../domain/model/store";

@Controller("v1/stores")
export class StoresController {
  constructor(
    @Inject(FIND_CLOSEST_STORE_PORT)
    private readonly findClosestStore: FindClosestStoreUseCase,
  ) {}

  @Get("closest")
  findClosest(): Promise<Store> {
    return this.findClosestStore.execute();
  }
}
