import { Transform } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

function transformCoordinate(value: unknown): number {
  if (typeof value !== "string" || value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

export class FindClosestStoreQuery {
  @Transform(({ value }) => transformCoordinate(value))
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-90)
  @Max(90)
  latitude!: number;

  @Transform(({ value }) => transformCoordinate(value))
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  longitude!: number;
}
