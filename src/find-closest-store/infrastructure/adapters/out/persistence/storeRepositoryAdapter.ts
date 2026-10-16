import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { StoreCandidate } from "@domain/model/storeCandidate";
import { StoreRepository } from "@domain/ports/out/storeRepository";
import { JoinedStoreScheduleRow } from "./entities/joinedStoreScheduledRow";

@Injectable()
export class StoreRepositoryAdapter implements StoreRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findCandidatesWithinRadius(
    latitude: number,
    longitude: number,
    radiusMeters: number,
  ): Promise<StoreCandidate[]> {
    const rows = await this.dataSource.query<Array<JoinedStoreScheduleRow>>(
      `
				SELECT
					stores.id AS "storeId",
					stores.name AS "storeName",
					ST_Y(stores.location::geometry) AS latitude,
					ST_X(stores.location::geometry) AS longitude,
					stores.timezone,
					ST_Distance(
						stores.location,
						ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
					) AS "distanceMeters"
					, schedules.id AS "scheduleId",
					schedules.day_of_week AS "scheduleDayOfWeek",
					schedules.start_time AS "scheduleStartTime",
					schedules.end_time AS "scheduleEndTime"
				FROM stores
				LEFT JOIN store_schedules AS schedules
					ON schedules.store_id = stores.id
				WHERE ST_DWithin(
					stores.location,
					ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
					$3
				)
				ORDER BY "distanceMeters" ASC, stores.id, schedules.day_of_week, schedules.start_time
			`,
      [longitude, latitude, radiusMeters],
    );

    const stores = rows
      .filter((row) =>
        [row.scheduleId, row.scheduleEndTime, row.scheduleDayOfWeek, row.scheduleStartTime].every(
          Boolean,
        ),
      )
      .reduce<Map<string, StoreCandidate>>((result, row) => {
        const candidate = result.get(row.storeId) ?? {
          store: {
            id: row.storeId,
            name: row.storeName,
            coordinates: {
              latitude: row.latitude,
              longitude: row.longitude,
            },
            timezone: row.timezone,
          },
          distanceMeters: row.distanceMeters,
          schedules: [],
        };

        if (!result.has(row.storeId)) {
          result.set(row.storeId, candidate);
        }

        candidate.schedules.push({
          id: row.scheduleId as string,
          storeId: row.storeId,
          dayOfWeek: row.scheduleDayOfWeek as number,
          startTime: row.scheduleStartTime as string,
          endTime: row.scheduleEndTime as string,
        });

        return result;
      }, new Map());

    return stores.values().toArray();
  }
}
