import { DateTime } from "luxon";

export const CLOCK_PORT = Symbol("CLOCK_PORT");

export interface ClockPort {
  now(): DateTime;
}
