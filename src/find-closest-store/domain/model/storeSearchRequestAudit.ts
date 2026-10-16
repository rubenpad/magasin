export interface StoreSearchRequestAudit {
  requestedAt: Date;
  requestedLatitude: number;
  requestedLongitude: number;
  maxSearchRadiusMeters: number;
  selectedStoreId: string | null;
  selectedStoreDistanceMeters: number | null;
  selectedStoreIsOpen: boolean | null;
  responseStatus: number;
}
