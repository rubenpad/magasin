export interface StoreSearchRequestEvent {
  requestedAt: Date;
  responseStatus: number;
  requestedLatitude: number;
  requestedLongitude: number;
  maxSearchRadiusMeters: number;
  selectedStoreId: string | null;
  selectedStoreIsOpen: boolean | null;
  selectedStoreDistanceMeters: number | null;
}
