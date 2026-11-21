import { DateTime } from "luxon";
import { Injectable } from "@nestjs/common";
import { ClockPort } from "@shared/domain/ports/out/ClockPort";

@Injectable()
export class SystemClockAdapter implements ClockPort {
  now(): DateTime {
    return DateTime.utc();
  }
}
