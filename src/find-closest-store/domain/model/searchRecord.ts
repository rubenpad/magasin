import { StoreSearchRequestEvent } from "../../../store-search-request/domain/model/storeSearchRequestEvent";

export type SearchRecord = Omit<StoreSearchRequestEvent, "requestId" | "requestedAt">;
