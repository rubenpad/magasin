import { Observable } from "rxjs";
import { StoreSearchRequestAudit } from "@domain/model/storeSearchRequestAudit";

export interface StoreSearchRequestAuditRepository {
  save(audit: StoreSearchRequestAudit): Observable<void>;
}
