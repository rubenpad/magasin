import { randomUUID } from "node:crypto";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { DateTime, Duration } from "luxon";
import { ConfigService } from "@nestjs/config";
import { StoreCandidate } from "@domain/model/storeCandidate";
import { ClosestOpenStore } from "@domain/model/closestOpenStore";
import { SearchRecord } from "@domain/model/searchRecord";
import { NoOpenStoreFoundError } from "@domain/exceptions/noOpenStoreFoundError";
import { StoreSearchUnavailableError } from "@domain/exceptions/storeSearchUnavailableError";
import { STORE_REPOSITORY, StoreRepositoryPort } from "@domain/ports/out/storeRepositoryPort";
import { FindClosestStoreUseCase } from "@domain/ports/in/findClosestStoreUseCase";
import {
  STORE_SEARCH_REQUEST_PUBLISHER,
  StoreSearchRequestPublisherPort,
} from "@domain/ports/out/storeSearchRequestPublisherPort";
import { CLOCK_PORT, ClockPort } from "@shared/domain/ports/out/ClockPort";
import { METRICS_PORT, MetricsPort } from "@shared/domain/ports/out/MetricsPort";
import { StoreSearchRequestEvent } from "../../../store-search-request/domain/model/storeSearchRequestEvent";

@Injectable()
export class FindClosestStoreService implements FindClosestStoreUseCase {
  private readonly logger = new Logger(FindClosestStoreService.name);
  private static readonly NEAR_RADIUS_THRESHOLD = 0.9;

  constructor(
    @Inject(CLOCK_PORT)
    private readonly clock: ClockPort,
    @Inject(METRICS_PORT)
    private readonly metricsPort: MetricsPort,
    @Inject(STORE_SEARCH_REQUEST_PUBLISHER)
    private readonly publisher: StoreSearchRequestPublisherPort,
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: StoreRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(latitude: number, longitude: number): Promise<ClosestOpenStore> {
    const referenceInstant = this.clock.now();
    const labels = this.metricLabels(latitude, longitude, referenceInstant);

    this.metricsPort.increment("store.search.requests.total", 1, labels);
    const radiusMeters = this.configService.getOrThrow<number>("MAX_STORE_SEARCH_RADIUS_KM") * 1000;
    let candidates: StoreCandidate[];

    try {
      candidates = await this.storeRepository.findCandidatesWithinRadius(
        latitude,
        longitude,
        radiusMeters,
        referenceInstant.toJSDate(),
      );
    } catch (error) {
      this.metricsPort.increment("store.search.errors.total", 1, labels);
      this.logger.error("Request failed trying to find closest store");
      throw new StoreSearchUnavailableError({ cause: error });
    }

    const candidate = candidates.find((candidate) =>
      this.isOpenAt(candidate, referenceInstant.setZone(candidate.store.timezone)),
    );

    this.metricsPort.increment("store.search.completed.total", 1, labels);

    if (!candidate) {
      this.metricsPort.increment("store.search.not.found.total", 1, labels);
      this.record(referenceInstant, labels, {
        requestedLatitude: latitude,
        requestedLongitude: longitude,
        maxSearchRadiusMeters: radiusMeters,
        selectedStoreId: null,
        selectedStoreDistanceMeters: null,
        selectedStoreIsOpen: null,
        responseStatus: 404,
      });
      throw new NoOpenStoreFoundError();
    }

    this.metricsPort.increment("store.search.found.total", 1, labels);
    this.metricsPort.observe(
      "store.search.selected_distance_meters",
      candidate.distanceMeters,
      labels,
    );

    if (candidate.distanceMeters >= radiusMeters * FindClosestStoreService.NEAR_RADIUS_THRESHOLD) {
      this.metricsPort.increment("store.search.near_radius_limit.total", 1, labels);
    }

    this.record(referenceInstant, labels, {
      requestedLatitude: latitude,
      requestedLongitude: longitude,
      maxSearchRadiusMeters: radiusMeters,
      selectedStoreId: candidate.store.id,
      selectedStoreDistanceMeters: candidate.distanceMeters,
      selectedStoreIsOpen: true,
      responseStatus: 200,
    });

    return {
      isOpen: true,
      storeId: candidate.store.id,
      storeName: candidate.store.name,
      coordinates: candidate.store.coordinates,
    };
  }

  private metricLabels(
    latitude: number,
    longitude: number,
    instant: DateTime,
  ): Record<string, string> {
    const utcHour = instant.toUTC().hour;
    const startHour = Math.floor(utcHour / 4) * 4;
    const timeBucket = `${String(startHour).padStart(2, "0")}-${String(startHour + 4).padStart(2, "0")}`;

    return {
      time_bucket_utc: timeBucket,
      area: `${Math.floor(latitude)}:${Math.floor(longitude)}`,
    };
  }

  private record(
    referenceInstant: DateTime,
    labels: Record<string, string>,
    record: SearchRecord,
  ): void {
    const event: StoreSearchRequestEvent = {
      requestId: randomUUID(),
      requestedAt: referenceInstant.toJSDate(),
      ...record,
    };

    this.publisher.publish(event).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      this.metricsPort.increment("store.search.audit_publish.errors.total", 1, labels);
      this.logger.error(`Failed to publish store search request ${event.requestId}: ${message}`);
    });
  }

  private isOpenAt(candidate: StoreCandidate, storeLocalDateTime: DateTime): boolean {
    if (!storeLocalDateTime.isValid) return false;

    const localTime = Duration.fromObject({
      hours: storeLocalDateTime.hour,
      minutes: storeLocalDateTime.minute,
      seconds: storeLocalDateTime.second,
      milliseconds: storeLocalDateTime.millisecond,
    }).as("milliseconds");

    return candidate.schedules.some(
      (schedule) =>
        schedule.dayOfWeek === storeLocalDateTime.weekday &&
        Duration.fromISOTime(schedule.startTime).as("milliseconds") <= localTime &&
        localTime < Duration.fromISOTime(schedule.endTime).as("milliseconds"),
    );
  }
}
