import { Store } from "@domain/model/store";
import { StoreSchedule } from "@domain/model/storeSchedule";

export interface StoreCandidate {
  store: Store;
  distanceMeters: number;
  schedules: Array<StoreSchedule>;
}
