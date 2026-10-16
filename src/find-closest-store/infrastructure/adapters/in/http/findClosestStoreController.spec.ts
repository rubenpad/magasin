import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DataSource } from "typeorm";
import { FindClosestStoreService } from "@domain/service/findClosestStoreService";
import { StoreRepositoryAdapter } from "@infrastructure/adapters/out/persistence/storeRepositoryAdapter";
import {
  FIND_CLOSEST_STORE_PORT,
  STORE_REPOSITORY,
} from "@infrastructure/configuration/findClosestStoreToken";
import { StoresController } from "@infrastructure/adapters/in/http/findClosestStoreController";
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
  const rows: JoinedStoreScheduleRow[] = [];

  for (const store of stores) {
    const storeFields = {
      storeId: store.id,
      storeName: store.name,
      latitude: 4.7112,
      longitude: -74.0718,
      timezone: "America/Bogota",
      distanceMeters: store.distanceMeters,
    };

    if (store.schedules.length === 0) {
      rows.push({
        ...storeFields,
        scheduleId: null,
        scheduleDayOfWeek: null,
        scheduleStartTime: null,
        scheduleEndTime: null,
      });
      continue;
    }

    for (const schedule of store.schedules) {
      rows.push({
        ...storeFields,
        scheduleId: schedule.id,
        scheduleDayOfWeek: schedule.dayOfWeek,
        scheduleStartTime: schedule.startTime,
        scheduleEndTime: schedule.endTime,
      });
    }
  }

  return rows;
}

describe("StoresController", () => {
  let app: NestFastifyApplication;

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
      {
        id: "unscheduled-store",
        name: "Unscheduled Store",
        distanceMeters: 10,
        schedules: [],
      },
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
      {
        id: "wrong-day-store",
        name: "Wrong Day Store",
        distanceMeters: 20,
        schedules: [
          { id: "open-yesterday", dayOfWeek: 3, startTime: "07:00:00", endTime: "09:00:00" },
        ],
      },
    ]),
  };

  beforeAll(async () => {
    const dataSource = {
      query: async (_sql: string, parameters?: unknown[]) => {
        const longitude = Number(parameters?.[0]);
        const latitude = Number(parameters?.[1]);
        const radiusMeters = Number(parameters?.[2]);
        const coordinateKey = `${latitude},${longitude}`;

        return (rowsByCoordinates[coordinateKey] ?? [])
          .filter((row) => row.distanceMeters <= radiusMeters)
          .sort((left, right) => left.distanceMeters - right.distanceMeters);
      },
    } as unknown as DataSource;
    const moduleRef = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        FindClosestStoreService,
        StoreRepositoryAdapter,
        {
          provide: FIND_CLOSEST_STORE_PORT,
          useExisting: FindClosestStoreService,
        },
        {
          provide: STORE_REPOSITORY,
          useExisting: StoreRepositoryAdapter,
        },
        {
          provide: ConfigService,
          useValue: new ConfigService({ MAX_STORE_SEARCH_RADIUS_KM: 10 }),
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "queueMicrotask"] });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(async () => {
    await app.close();
  });

  it("selects an open interval among multiple schedules at the nearest store", async () => {
    jest.setSystemTime(new Date("2026-10-15T13:00:00.000Z"));

    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject("/v1/stores/closest?latitude=4.7110&longitude=-74.0721");

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      storeId: "near-store",
      storeName: "Near Store",
      isOpen: true,
      coordinates: { latitude: 4.7112, longitude: -74.0718 },
    });
  });

  it("skips a store without schedules and selects a farther open store", async () => {
    jest.setSystemTime(new Date("2026-10-15T13:00:00.000Z"));

    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject("/v1/stores/closest?latitude=4.7120&longitude=-74.0721");

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ storeId: "open-store", isOpen: true });
  });

  it("returns 404 for a store outside the configured radius", async () => {
    jest.setSystemTime(new Date("2026-10-15T13:00:00.000Z"));

    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject("/v1/stores/closest?latitude=4.7130&longitude=-74.0721");

    expect(response.statusCode).toBe(404);
  });

  it("returns 404 when schedules are outside the current weekday or time", async () => {
    jest.setSystemTime(new Date("2026-10-15T13:00:00.000Z"));

    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject("/v1/stores/closest?latitude=4.7140&longitude=-74.0721");

    expect(response.statusCode).toBe(404);
  });

  it("rejects invalid coordinates before querying the datastore", async () => {
    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject("/v1/stores/closest?latitude=91&longitude=-74.0721");

    expect(response.statusCode).toBe(400);
  });
});
