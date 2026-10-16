import { z } from "zod";

export const findClosestStoreQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export type FindClosestStoreQuery = z.infer<typeof findClosestStoreQuerySchema>;
