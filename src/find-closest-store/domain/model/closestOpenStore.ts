import { Store } from "@domain/model/store";

export interface ClosestOpenStore {
  storeId: string;
  storeName: string;
  isOpen: true;
  coordinates: Store["coordinates"];
}
