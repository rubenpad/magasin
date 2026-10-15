import { Injectable } from "@nestjs/common";
import { FindClosestStoreUseCase } from "../ports/in/findClosestStoreUseCase";
import { Store } from "../model/store";

@Injectable()
export class FindClosestStoreService implements FindClosestStoreUseCase {
  async execute(): Promise<Store> {
    return {};
  }
}
