import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { StoreSearchRequestAudit } from "@domain/model/storeSearchRequestAudit";
import { StoreSearchRequestAuditRepository } from "@domain/ports/out/storeSearchRequestAuditRepository";

@Injectable()
export class StoreSearchRequestAuditRepositoryAdapter implements StoreSearchRequestAuditRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  save(audit: StoreSearchRequestAudit): Promise<void> {
    return this.dataSource
      .query(
        `
          INSERT INTO store_search_requests (
            requested_at,
            requested_location,
            max_search_radius_meters,
            selected_store_id,
            selected_store_distance_meters,
            selected_store_is_open,
            response_status
          ) VALUES (
            $1,
            ST_SetSRID(ST_MakePoint($3, $2), 4326)::geography,
            $4,
            $5,
            $6,
            $7,
            $8
          )
        `,
        [
          audit.requestedAt,
          audit.requestedLatitude,
          audit.requestedLongitude,
          audit.maxSearchRadiusMeters,
          audit.selectedStoreId,
          audit.selectedStoreDistanceMeters,
          audit.selectedStoreIsOpen,
          audit.responseStatus,
        ],
      )
      .then(() => undefined);
  }
}
