import { StoreSearchRequestEvent } from "../../model/storeSearchRequestEvent";

export interface StoreSearchRequestUseCase {
  execute(storeSearchRequestEvent: StoreSearchRequestEvent): Promise<void>;
}
