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
  STORE_REPOSITORY,
  STORE_SEARCH_REQUEST_AUDIT_REPOSITORY,
} from "@infrastructure/configuration/findClosestStoreToken";
import { DateTime, Duration } from "luxon";
import { EMPTY, catchError } from "rxjs";
import { StoreSearchRequestAudit } from "@domain/model/storeSearchRequestAudit";

@Injectable()
export class FindClosestStoreService implements FindClosestStoreUseCase {
  private readonly logger = new Logger(FindClosestStoreService.name);

  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: StoreRepository,
    private readonly configService: ConfigService,
    @Inject(STORE_SEARCH_REQUEST_AUDIT_REPOSITORY)
    private readonly auditRepository: StoreSearchRequestAuditRepository,
  ) {}

  async execute(latitude: number, longitude: number): Promise<ClosestOpenStore> {
    const radiusMeters = this.configService.getOrThrow<number>("MAX_STORE_SEARCH_RADIUS_KM") * 1000;
    let candidates: StoreCandidate[];

    try {
      candidates = await this.storeRepository.findCandidatesWithinRadius(
        latitude,
        longitude,
        radiusMeters,
      );
    } catch (error) {
      this.logger.error("Request failed trying to find closest store");
      throw new ServiceUnavailableException("Store search is unavailable", {
        cause: error,
      });
    }

    const referenceInstant = DateTime.now();
    const candidate = candidates.find((candidate) =>
      this.isOpenAt(candidate, referenceInstant.setZone(candidate.store.timezone)),
    );

    if (candidate) {
      this.persistAudit({
        requestedAt: referenceInstant.toJSDate(),
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

    this.persistAudit({
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

  private persistAudit(audit: StoreSearchRequestAudit): void {
    this.auditRepository
      .save(audit)
      .pipe(
        catchError((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          this.logger.error(`Failed to persist store search audit ${message}`);
          return EMPTY;
        }),
      )
      .subscribe();
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
