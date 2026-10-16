import { ClosestOpenStore } from "@domain/model/closestOpenStore";

export interface FindClosestStoreUseCase {
  execute(latitude: number, longitude: number): Promise<ClosestOpenStore>;
}
