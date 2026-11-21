import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { StoreCandidate } from "@domain/model/storeCandidate";
import { StoreRepositoryPort } from "@domain/ports/out/storeRepositoryPort";
import { JoinedStoreScheduleRow } from "./entities/joinedStoreScheduledRow";

@Injectable()
export class StoreRepositoryAdapter implements StoreRepositoryPort {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findCandidatesWithinRadius(
    latitude: number,
    longitude: number,
    radiusMeters: number,
    referenceInstant: Date,
  ): Promise<StoreCandidate[]> {
    const rows = await this.dataSource.query<Array<JoinedStoreScheduleRow>>(
      `
        WITH requested AS (
          SELECT ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography AS point
        )
        SELECT
          stores.id AS "storeId",
          stores.name AS "storeName",
          ST_Y(stores.location::geometry) AS latitude,
          ST_X(stores.location::geometry) AS longitude,
          stores.timezone,
          ST_Distance(stores.location, requested.point) AS "distanceMeters",
          schedules.id AS "scheduleId",
          schedules.day_of_week AS "scheduleDayOfWeek",
          schedules.start_time AS "scheduleStartTime",
          schedules.end_time AS "scheduleEndTime"
        FROM stores
        CROSS JOIN requested
        JOIN store_schedules AS schedules
          ON schedules.store_id = stores.id
         AND schedules.day_of_week = EXTRACT(ISODOW FROM ($4::timestamptz AT TIME ZONE stores.timezone))::smallint
        WHERE ST_DWithin(stores.location, requested.point, $3)
        ORDER BY "distanceMeters" ASC, stores.id, schedules.start_time
      `,
      [longitude, latitude, radiusMeters, referenceInstant],
    );

    const candidates = new Map<string, StoreCandidate>();

    for (const row of rows) {
      const candidate = candidates.getOrInsertComputed(row.storeId, () => ({
        store: {
          id: row.storeId,
          name: row.storeName,
          coordinates: { latitude: row.latitude, longitude: row.longitude },
          timezone: row.timezone,
        },
        distanceMeters: row.distanceMeters,
        schedules: [],
      }));

      candidate.schedules.push({
        id: row.scheduleId,
        storeId: row.storeId,
        dayOfWeek: row.scheduleDayOfWeek,
        startTime: row.scheduleStartTime,
        endTime: row.scheduleEndTime,
      });
    }

    return [...candidates.values()];
  }
}
