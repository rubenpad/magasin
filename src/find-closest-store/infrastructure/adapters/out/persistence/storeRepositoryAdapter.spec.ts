import { DataSource } from "typeorm";
import { StoreCandidate } from "@domain/model/storeCandidate";
import { StoreRepositoryAdapter } from "@infrastructure/adapters/out/persistence/storeRepositoryAdapter";

describe("StoreRepositoryAdapter", () => {
  it("loads stores and their schedules for the local weekday in one nearest-first query", async () => {
    const queryCalls: Array<{ query: string; parameters?: unknown[] }> = [];
    const queryRows = [
      {
        storeId: "store-id",
        storeName: "Central Convenience",
        latitude: 4.7112,
        longitude: -74.0718,
        timezone: "America/Bogota",
        distanceMeters: 42,
        scheduleId: "schedule-id",
        scheduleDayOfWeek: 4,
        scheduleStartTime: "08:00:00",
        scheduleEndTime: "20:00:00",
      },
      {
        storeId: "store-id",
        storeName: "Central Convenience",
        latitude: 4.7112,
        longitude: -74.0718,
        timezone: "America/Bogota",
        distanceMeters: 42,
        scheduleId: "schedule-id-2",
        scheduleDayOfWeek: 5,
        scheduleStartTime: "08:00:00",
        scheduleEndTime: "20:00:00",
      },
    ];
    const dataSource = {
      query: async (query: string, parameters?: unknown[]) => {
        queryCalls.push({ query, parameters });
        return queryRows;
      },
    } as unknown as DataSource;
    const repository = new StoreRepositoryAdapter(dataSource);
    const candidate: StoreCandidate = {
      store: {
        id: "store-id",
        name: "Central Convenience",
        coordinates: { latitude: 4.7112, longitude: -74.0718 },
        timezone: "America/Bogota",
      },
      distanceMeters: 42,
      schedules: [
        {
          id: "schedule-id",
          storeId: "store-id",
          dayOfWeek: 4,
          startTime: "08:00:00",
          endTime: "20:00:00",
        },
        {
          id: "schedule-id-2",
          storeId: "store-id",
          dayOfWeek: 5,
          startTime: "08:00:00",
          endTime: "20:00:00",
        },
      ],
    };

    const referenceInstant = new Date("2026-10-15T13:00:00.000Z");

    await expect(
      repository.findCandidatesWithinRadius(4.711, -74.0721, 10_000, referenceInstant),
    ).resolves.toEqual([candidate]);

    expect(queryCalls).toHaveLength(1);
    expect(queryCalls[0].query).toContain("JOIN store_schedules");
    expect(queryCalls[0].query).not.toContain("LEFT JOIN");
    expect(queryCalls[0].query).toContain(
      "EXTRACT(ISODOW FROM ($4::timestamptz AT TIME ZONE stores.timezone))",
    );
    expect(queryCalls[0].query).toContain("ST_DWithin");
    expect(queryCalls[0].query).toContain('ORDER BY "distanceMeters" ASC');
    expect(queryCalls[0].parameters).toEqual([-74.0721, 4.711, 10_000, referenceInstant]);
  });
});
