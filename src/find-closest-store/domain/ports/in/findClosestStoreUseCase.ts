import { ClosestOpenStore } from "@domain/model/closestOpenStore";

export const FIND_CLOSEST_STORE_PORT = Symbol("FIND_CLOSEST_STORE_PORT");

export interface FindClosestStoreUseCase {
  execute(latitude: number, longitude: number): Promise<ClosestOpenStore>;
}
