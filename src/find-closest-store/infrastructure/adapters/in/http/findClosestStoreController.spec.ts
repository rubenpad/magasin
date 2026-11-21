import { setImmediate } from "node:timers/promises";
import { DateTime } from "luxon";
import { LoggerModule } from "nestjs-pino";
import { DataSource } from "typeorm";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { StandardSchemaValidationPipe } from "@nestjs/common";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { CLOCK_PORT } from "@shared/domain/ports/out/ClockPort";
import { METRICS_PORT } from "@shared/domain/ports/out/MetricsPort";
import { FindClosestStoreService } from "@domain/service/findClosestStoreService";
import { FIND_CLOSEST_STORE_PORT } from "@domain/ports/in/findClosestStoreUseCase";
import { STORE_REPOSITORY } from "@domain/ports/out/storeRepositoryPort";
import { STORE_SEARCH_REQUEST_PUBLISHER } from "@domain/ports/out/storeSearchRequestPublisherPort";
import { StoresController } from "@infrastructure/adapters/in/http/findClosestStoreController";
import { StoreRepositoryAdapter } from "@infrastructure/adapters/out/persistence/storeRepositoryAdapter";
import { JoinedStoreScheduleRow } from "@infrastructure/adapters/out/persistence/entities/joinedStoreScheduledRow";

interface ScheduleFixture {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface StoreFixture {
  id: string;
  name: string;
  distanceMeters: number;
  schedules: ScheduleFixture[];
}

function joinedRows(stores: StoreFixture[]): JoinedStoreScheduleRow[] {
  return stores.flatMap((store) =>
    store.schedules.map((schedule) => ({
      storeId: store.id,
      storeName: store.name,
      latitude: 4.7112,
      longitude: -74.0718,
      timezone: "America/Bogota",
      distanceMeters: store.distanceMeters,
      scheduleId: schedule.id,
      scheduleDayOfWeek: schedule.dayOfWeek,
      scheduleStartTime: schedule.startTime,
      scheduleEndTime: schedule.endTime,
    })),
  );
}

const THURSDAY_8AM_BOGOTA = DateTime.fromISO("2026-10-15T13:00:00.000Z", { zone: "utc" });

describe("StoresController", () => {
  let app: NestFastifyApplication;
  let now = THURSDAY_8AM_BOGOTA;
  const publish = jest.fn((_event: unknown) => Promise.resolve());
  const metricsIncrement = jest.fn();
  const metricsObserve = jest.fn();
  const query = jest.fn();

  const rowsByCoordinates: Readonly<Record<string, JoinedStoreScheduleRow[]>> = {
    "4.711,-74.0721": joinedRows([
      {
        id: "near-store",
        name: "Near Store",
        distanceMeters: 20,
        schedules: [
          { id: "near-closed", dayOfWeek: 4, startTime: "09:00:00", endTime: "10:00:00" },
          { id: "near-open", dayOfWeek: 4, startTime: "08:00:00", endTime: "09:00:00" },
        ],
      },
      {
        id: "far-store",
        name: "Far Store",
        distanceMeters: 42,
        schedules: [{ id: "far-open", dayOfWeek: 4, startTime: "07:00:00", endTime: "09:00:00" }],
      },
    ]),
    "4.712,-74.0721": joinedRows([
      { id: "unscheduled-store", name: "Unscheduled Store", distanceMeters: 10, schedules: [] },
      {
        id: "open-store",
        name: "Open Store",
        distanceMeters: 30,
        schedules: [{ id: "open", dayOfWeek: 4, startTime: "08:00:00", endTime: "09:00:00" }],
      },
    ]),
    "4.713,-74.0721": joinedRows([
      {
        id: "far-store",
        name: "Far Store",
        distanceMeters: 10_001,
        schedules: [{ id: "open", dayOfWeek: 4, startTime: "08:00:00", endTime: "09:00:00" }],
      },
    ]),
    "4.714,-74.0721": joinedRows([
      {
        id: "wrong-time-store",
        name: "Wrong Time Store",
        distanceMeters: 10,
        schedules: [
          { id: "closed-today", dayOfWeek: 4, startTime: "09:00:00", endTime: "10:00:00" },
        ],
      },
    ]),
    "4.715,-74.0721": joinedRows([
      {
        id: "all-day-store",
        name: "All Day Store",
        distanceMeters: 10,
        schedules: [{ id: "all-day", dayOfWeek: 4, startTime: "00:00:00", endTime: "24:00:00" }],
      },
    ]),
  };

  const defaultQuery = async (_sql: string, parameters?: unknown[]) => {
    const longitude = Number(parameters?.[0]);
    const latitude = Number(parameters?.[1]);
    const radiusMeters = Number(parameters?.[2]);

    return (rowsByCoordinates[`${latitude},${longitude}`] ?? [])
      .filter((row) => row.distanceMeters <= radiusMeters)
      .sort((left, right) => left.distanceMeters - right.distanceMeters);
  };

  const get = (url: string) => app.getHttpAdapter().getInstance().inject(url);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [StoresController],
      providers: [
        { provide: CLOCK_PORT, useValue: { now: () => now } },
        {
          provide: METRICS_PORT,
          useValue: { increment: metricsIncrement, observe: metricsObserve },
        },
        { provide: STORE_SEARCH_REQUEST_PUBLISHER, useValue: { publish } },
        { provide: STORE_REPOSITORY, useClass: StoreRepositoryAdapter },
        { provide: FIND_CLOSEST_STORE_PORT, useClass: FindClosestStoreService },
        { provide: ConfigService, useValue: new ConfigService({ MAX_STORE_SEARCH_RADIUS_KM: 10 }) },
        { provide: DataSource, useValue: { query } as unknown as DataSource },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.useGlobalPipes(new StandardSchemaValidationPipe());
    await app.init();
  });

  beforeEach(() => {
    now = THURSDAY_8AM_BOGOTA;
    query.mockReset().mockImplementation(defaultQuery);
    publish.mockReset().mockResolvedValue(undefined);
    metricsIncrement.mockClear();
    metricsObserve.mockClear();
  });

  afterAll(async () => {
    await app.close();
  });

  it("selects an open interval among multiple schedules at the nearest store", async () => {
    const response = await get("/v1/stores/closest?latitude=4.7110&longitude=-74.0721");

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      storeId: "near-store",
      storeName: "Near Store",
      isOpen: true,
      coordinates: { latitude: 4.7112, longitude: -74.0718 },
    });
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        requestId: expect.stringMatching(/^[0-9a-f-]{36}$/),
        requestedAt: THURSDAY_8AM_BOGOTA.toJSDate(),
        requestedLatitude: 4.711,
        requestedLongitude: -74.0721,
        maxSearchRadiusMeters: 10_000,
        selectedStoreId: "near-store",
        selectedStoreDistanceMeters: 20,
        selectedStoreIsOpen: true,
        responseStatus: 200,
      }),
    );
  });

  it("passes the reference instant to the repository so it can filter by local weekday", async () => {
    await get("/v1/stores/closest?latitude=4.7110&longitude=-74.0721");

    expect(query).toHaveBeenCalledWith(expect.any(String), [
      -74.0721,
      4.711,
      10_000,
      THURSDAY_8AM_BOGOTA.toJSDate(),
    ]);
  });

  it("skips a store without schedules and selects a farther open store", async () => {
    const response = await get("/v1/stores/closest?latitude=4.7120&longitude=-74.0721");

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ storeId: "open-store", isOpen: true });
  });

  it("returns the store and counts the failure when publishing the search record fails", async () => {
    publish.mockRejectedValueOnce(new Error("failed publishing to queue"));

    const response = await get("/v1/stores/closest?latitude=4.7120&longitude=-74.0721");
    await setImmediate();

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ storeId: "open-store", isOpen: true });
    expect(metricsIncrement).toHaveBeenCalledWith(
      "store.search.audit_publish.errors.total",
      1,
      expect.any(Object),
    );
  });

  it("does not wait for the search record to be published", async () => {
    publish.mockReturnValueOnce(Promise.withResolvers<void>().promise);

    const response = await get("/v1/stores/closest?latitude=4.7120&longitude=-74.0721");

    expect(response.statusCode).toBe(200);
  });

  it("returns 404 for a store outside the configured radius", async () => {
    const response = await get("/v1/stores/closest?latitude=4.7130&longitude=-74.0721");

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      message: "No open store is available for the requested location",
    });
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedStoreId: null,
        selectedStoreDistanceMeters: null,
        selectedStoreIsOpen: null,
        responseStatus: 404,
      }),
    );
  });

  it("returns 404 when no schedule covers the current local time", async () => {
    const response = await get("/v1/stores/closest?latitude=4.7140&longitude=-74.0721");

    expect(response.statusCode).toBe(404);
  });

  it("treats a 24:00:00 end time as open through the last second of the day", async () => {
    now = DateTime.fromISO("2026-10-15T23:59:59.900", { zone: "America/Bogota" });

    const response = await get("/v1/stores/closest?latitude=4.7150&longitude=-74.0721");

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ storeId: "all-day-store" });
  });

  it("returns 503 when the store data cannot be read", async () => {
    query.mockRejectedValueOnce(new Error("connection refused"));

    const response = await get("/v1/stores/closest?latitude=4.7110&longitude=-74.0721");

    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({ statusCode: 503, message: "Store search is unavailable" });
  });

  it.each([
    ["an out-of-range latitude", "latitude=91&longitude=-74.0721"],
    ["an empty latitude", "latitude=&longitude=-74.0721"],
    ["a blank longitude", "latitude=4.711&longitude=%20"],
    ["a missing longitude", "latitude=4.711"],
    ["a non-numeric latitude", "latitude=abc&longitude=-74.0721"],
    ["a repeated latitude", "latitude=1&latitude=2&longitude=-74.0721"],
  ])("rejects %s before querying the datastore", async (_case, queryString) => {
    const response = await get(`/v1/stores/closest?${queryString}`);

    expect(response.statusCode).toBe(400);
    expect(query).not.toHaveBeenCalled();
  });
});
