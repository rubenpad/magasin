import { StoreSearchRequestEvent } from "../../model/storeSearchRequestEvent";

export const STORE_SEARCH_REQUEST_REPOSITORY = Symbol("STORE_SEARCH_REQUEST_REPOSITORY");

export interface StoreSearchRequestRepositoryPort {
  save(audit: StoreSearchRequestEvent): Promise<void>;
}
