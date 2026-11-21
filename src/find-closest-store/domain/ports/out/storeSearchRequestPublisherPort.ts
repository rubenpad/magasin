import { StoreSearchRequestEvent } from "../../../../store-search-request/domain/model/storeSearchRequestEvent";

export const STORE_SEARCH_REQUEST_PUBLISHER = Symbol("STORE_SEARCH_REQUEST_PUBLISHER");

export interface StoreSearchRequestPublisherPort {
  publish(event: StoreSearchRequestEvent): Promise<void>;
}
