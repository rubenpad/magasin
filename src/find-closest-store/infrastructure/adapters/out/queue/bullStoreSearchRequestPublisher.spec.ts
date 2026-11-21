import { setTimeout } from "node:timers/promises";
import { Queue } from "bull";
import { ConfigService } from "@nestjs/config";
import { JobName } from "@shared/infrastructure/queue/queueNames";
import { StoreSearchRequestEvent } from "../../../../../store-search-request/domain/model/storeSearchRequestEvent";
import {
  BullStoreSearchRequestPublisher,
  PublishRejectedError,
} from "./bullStoreSearchRequestPublisher";

const event: StoreSearchRequestEvent = {
  requestId: "6a3b7a9e-3f5c-4c55-9d38-2f9f4a1f2b10",
  requestedAt: new Date("2026-10-15T13:00:00.000Z"),
  responseStatus: 404,
  requestedLatitude: 4.711,
  requestedLongitude: -74.0721,
  maxSearchRadiusMeters: 10_000,
  selectedStoreId: null,
  selectedStoreIsOpen: null,
  selectedStoreDistanceMeters: null,
};

function publisherWith(add: jest.Mock, maxInFlight = 10) {
  const config = new ConfigService({ AUDIT_PUBLISH_MAX_IN_FLIGHT: maxInFlight });
  return new BullStoreSearchRequestPublisher({ add } as unknown as Queue, config);
}

describe("BullStoreSearchRequestPublisher", () => {
  it("adds the job using the request id as the job id", async () => {
    const add = jest.fn(() => Promise.resolve());

    await publisherWith(add).publish(event);

    expect(add).toHaveBeenCalledWith(JobName.SAVE_STORE_SEARCH_REQUEST, event, {
      jobId: event.requestId,
    });
  });

  it("waits for a slow publish instead of reporting it as failed", async () => {
    const slowAdd = Promise.withResolvers<void>();
    const add = jest.fn(() => slowAdd.promise);

    const publishing = publisherWith(add).publish(event);
    await setTimeout(200);
    slowAdd.resolve();

    await expect(publishing).resolves.toBeUndefined();
  });

  it("propagates errors from the queue", async () => {
    const add = jest.fn(() => Promise.reject(new Error("Redis connection lost")));

    await expect(publisherWith(add).publish(event)).rejects.toThrow("Redis connection lost");
  });

  it("rejects new publishes while too many are still pending", async () => {
    const add = jest.fn(() => Promise.withResolvers<void>().promise);
    const publisher = publisherWith(add, 1);

    void publisher.publish(event);

    await expect(publisher.publish(event)).rejects.toThrow(
      new PublishRejectedError("Publish backlog is full (1 in flight)"),
    );
    expect(add).toHaveBeenCalledTimes(1);
  });

  it("frees capacity once a pending publish settles, even when it fails", async () => {
    const add = jest
      .fn()
      .mockRejectedValueOnce(new Error("Redis connection lost"))
      .mockResolvedValue(undefined);
    const publisher = publisherWith(add, 1);

    await expect(publisher.publish(event)).rejects.toThrow("Redis connection lost");
    await expect(publisher.publish(event)).resolves.toBeUndefined();
  });
});
