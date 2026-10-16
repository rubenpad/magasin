import { StoreCandidate } from "@domain/model/storeCandidate";

export interface StoreRepository {
  findCandidatesWithinRadius(
    latitude: number,
    longitude: number,
    radiusMeters: number,
  ): Promise<StoreCandidate[]>;
}
