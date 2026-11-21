import { StoreSearchRequestEvent } from "../../model/storeSearchRequestEvent";

export interface StoreSearchRequestRepositoryPort {
  save(audit: StoreSearchRequestEvent): Promise<void>;
}
