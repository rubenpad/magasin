import { z } from "zod";

const coordinate = (min: number, max: number) =>
  z.string().trim().min(1).pipe(z.coerce.number<string>().min(min).max(max));

export const findClosestStoreQuerySchema = z.object({
  latitude: coordinate(-90, 90),
  longitude: coordinate(-180, 180),
});

export type FindClosestStoreQuery = z.infer<typeof findClosestStoreQuerySchema>;
