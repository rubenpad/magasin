import { StoreSearchRequestEvent } from "../../model/storeSearchRequestEvent";

export const STORE_SEARCH_REQUEST_PORT = Symbol("STORE_SEARCH_REQUEST_PORT");

export interface StoreSearchRequestUseCase {
  execute(storeSearchRequestEvent: StoreSearchRequestEvent): Promise<void>;
}
