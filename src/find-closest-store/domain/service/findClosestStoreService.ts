import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StoreCandidate } from "@domain/model/storeCandidate";
import { ClosestOpenStore } from "@domain/model/closestOpenStore";
import { StoreRepository } from "@domain/ports/out/storeRepository";
import { FindClosestStoreUseCase } from "@domain/ports/in/findClosestStoreUseCase";
import { StoreSearchRequestAuditRepository } from "@domain/ports/out/storeSearchRequestAuditRepository";
import {
  METRICS_PORT,
  STORE_REPOSITORY,
  STORE_SEARCH_REQUEST_AUDIT_REPOSITORY,
} from "@infrastructure/configuration/findClosestStoreToken";
import { DateTime, Duration } from "luxon";
import { StoreSearchRequestAudit } from "@domain/model/storeSearchRequestAudit";
import { MetricsPort } from "@shared/domain/ports/out/MetricsPort";

@Injectable()
export class FindClosestStoreService implements FindClosestStoreUseCase {
  private readonly logger = new Logger(FindClosestStoreService.name);
  private static readonly NEAR_RADIUS_THRESHOLD = 0.9;

  constructor(
    @Inject(METRICS_PORT)
    private readonly metricsPort: MetricsPort,
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: StoreRepository,
    private readonly configService: ConfigService,
    @Inject(STORE_SEARCH_REQUEST_AUDIT_REPOSITORY)
    private readonly auditRepository: StoreSearchRequestAuditRepository,
  ) {}

  async execute(latitude: number, longitude: number): Promise<ClosestOpenStore> {
    const referenceInstant = DateTime.now();
    const labels = this.metricLabels(latitude, longitude, referenceInstant);

    this.metricsPort.increment("store.search.requests.total", 1, labels);
    const radiusMeters = this.configService.getOrThrow<number>("MAX_STORE_SEARCH_RADIUS_KM") * 1000;
    let candidates: StoreCandidate[];

    try {
      candidates = await this.storeRepository.findCandidatesWithinRadius(
        latitude,
        longitude,
        radiusMeters,
      );
    } catch (error) {
      this.metricsPort.increment("store.search.errors.total", 1, labels);
      this.logger.error("Request failed trying to find closest store");
      throw new ServiceUnavailableException("Store search is unavailable", {
        cause: error,
      });
    }

    const candidate = candidates.find((candidate) =>
      this.isOpenAt(candidate, referenceInstant.setZone(candidate.store.timezone)),
    );

    if (candidate) {
      this.metricsPort.increment("store.search.completed.total", 1, labels);
      this.metricsPort.increment("store.search.found.total", 1, labels);
      this.metricsPort.observe(
        "store.search.selected_distance_meters",
        candidate.distanceMeters,
        labels,
      );

      if (
        candidate.distanceMeters >=
        radiusMeters * FindClosestStoreService.NEAR_RADIUS_THRESHOLD
      ) {
        this.metricsPort.increment("store.search.near_radius_limit.total", 1, labels);
      }

      await this.persistAuditAsync({
        responseStatus: 200,
        selectedStoreIsOpen: true,
        requestedLatitude: latitude,
        requestedLongitude: longitude,
        maxSearchRadiusMeters: radiusMeters,
        selectedStoreId: candidate.store.id,
        requestedAt: referenceInstant.toJSDate(),
        selectedStoreDistanceMeters: candidate.distanceMeters,
      });

      return {
        isOpen: true,
        storeId: candidate.store.id,
        storeName: candidate.store.name,
        coordinates: candidate.store.coordinates,
      };
    }

    this.metricsPort.increment("store.search.completed.total", 1, labels);
    this.metricsPort.increment("store.search.not.found.total", 1, labels);
    await this.persistAuditAsync({
      requestedAt: referenceInstant.toJSDate(),
      requestedLatitude: latitude,
      requestedLongitude: longitude,
      maxSearchRadiusMeters: radiusMeters,
      selectedStoreId: null,
      selectedStoreDistanceMeters: null,
      selectedStoreIsOpen: null,
      responseStatus: 404,
    });

    throw new NotFoundException("No open store is available for the requested location");
  }

  private metricLabels(
    latitude: number,
    longitude: number,
    instant: DateTime,
  ): Record<string, string> {
    const latitudeBucket = Math.floor(latitude);
    const longitudeBucket = Math.floor(longitude);
    const startTime = String(Math.floor(instant.hour / 4) * 4).padStart(2, "0");
    const endTime = String(Math.floor(instant.hour / 4) * 4 + 4).padStart(2, "0");
    const timeBucket = `${startTime}-${endTime}`;

    return {
      time_bucket_utc: timeBucket,
      area: `${latitudeBucket}:${longitudeBucket}`,
    };
  }

  private async persistAuditAsync(audit: StoreSearchRequestAudit): Promise<void> {
    try {
      await this.auditRepository.save(audit);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to persist store search audit ${message}`);
    }
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
