import { StoreCandidate } from "@domain/model/storeCandidate";

export const STORE_REPOSITORY = Symbol("STORE_REPOSITORY");

export interface StoreRepositoryPort {
  findCandidatesWithinRadius(
    latitude: number,
    longitude: number,
    radiusMeters: number,
    referenceInstant: Date,
  ): Promise<StoreCandidate[]>;
}
