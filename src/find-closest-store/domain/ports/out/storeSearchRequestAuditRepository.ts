import { StoreSearchRequestAudit } from "@domain/model/storeSearchRequestAudit";

export interface StoreSearchRequestAuditRepository {
  save(audit: StoreSearchRequestAudit): Promise<void>;
}
