import { Inject, Injectable, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClosestOpenStore } from "@domain/model/closestOpenStore";
import { StoreCandidate } from "@domain/model/storeCandidate";
import { FindClosestStoreUseCase } from "@domain/ports/in/findClosestStoreUseCase";
import { StoreRepository } from "@domain/ports/out/storeRepository";
import { STORE_REPOSITORY } from "@infrastructure/configuration/findClosestStoreToken";
import { DateTime, Duration } from "luxon";

@Injectable()
export class FindClosestStoreService implements FindClosestStoreUseCase {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: StoreRepository,
    private readonly configService: ConfigService,
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
      throw new ServiceUnavailableException("Store search is unavailable", {
        cause: error,
      });
    }

    const referenceInstant = DateTime.now();
    const candidate = candidates.find((candidate) =>
      this.isOpenAt(candidate, referenceInstant.setZone(candidate.store.timezone)),
    );

    if (candidate) {
      return {
        isOpen: true,
        storeId: candidate.store.id,
        storeName: candidate.store.name,
        coordinates: candidate.store.coordinates,
      };
    }

    throw new NotFoundException("No open store is available for the requested location");
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
