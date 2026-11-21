import { StoreCandidate } from "@domain/model/storeCandidate";

export interface StoreRepositoryPort {
  findCandidatesWithinRadius(
    latitude: number,
    longitude: number,
    radiusMeters: number,
  ): Promise<StoreCandidate[]>;
}
