import { Job, Queue } from "bull";
import { ConfigService } from "@nestjs/config";
import { JobName } from "@shared/infrastructure/queue/queueNames";
import { QueuedStoreSearchRequest, StoreSearchRequestListener } from "./storeSearchRequestListener";
import { StoreSearchRequestService } from "../../../domain/service/storeSearchRequestService";
import { StoreSearchRequestEvent } from "../../../domain/model/storeSearchRequestEvent";

const event: StoreSearchRequestEvent = {
  requestId: "6a3b7a9e-3f5c-4c55-9d38-2f9f4a1f2b10",
  requestedAt: new Date("2026-10-15T13:00:00.000Z"),
  responseStatus: 200,
  requestedLatitude: 4.711,
  requestedLongitude: -74.0721,
  maxSearchRadiusMeters: 10_000,
  selectedStoreId: "store-id",
  selectedStoreIsOpen: true,
  selectedStoreDistanceMeters: 20,
};

const job = {
  data: { ...event, requestedAt: event.requestedAt.toISOString() },
} as Job<QueuedStoreSearchRequest>;

function listenerWith(save: jest.Mock, process: jest.Mock = jest.fn()) {
  return new StoreSearchRequestListener(
    { process } as unknown as Queue,
    new StoreSearchRequestService({ save }),
    new ConfigService({ STORE_SEARCH_REQUEST_WORKER_CONCURRENCY: 3 }),
  );
}

describe("StoreSearchRequestListener", () => {
  it("registers the job processor with the configured concurrency", () => {
    const process = jest.fn();

    listenerWith(jest.fn(), process).onModuleInit();

    expect(process).toHaveBeenCalledWith(
      JobName.SAVE_STORE_SEARCH_REQUEST,
      3,
      expect.any(Function),
    );
  });

  it("resolves only after the record is saved, with the date restored", async () => {
    const pendingSave = Promise.withResolvers<void>();
    const save = jest.fn(() => pendingSave.promise);
    const listener = listenerWith(save);

    let settled = false;
    const handled = listener.handleStoreSearchRequestEvent(job).then(() => (settled = true));
    await Promise.resolve();

    expect(settled).toBe(false);
    expect(save).toHaveBeenCalledWith(event);

    pendingSave.resolve();
    await handled;
    expect(settled).toBe(true);
  });

  it("rejects when saving fails so the queue retries the job", async () => {
    const save = jest.fn(() => Promise.reject(new Error("database is down")));

    await expect(listenerWith(save).handleStoreSearchRequestEvent(job)).rejects.toThrow(
      "database is down",
    );
  });
});
