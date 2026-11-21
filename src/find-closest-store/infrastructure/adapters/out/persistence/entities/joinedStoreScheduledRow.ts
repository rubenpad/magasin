export interface JoinedStoreScheduleRow {
  storeId: string;
  storeName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  distanceMeters: number;
  scheduleId: string | null;
  scheduleDayOfWeek: number | null;
  scheduleStartTime: string | null;
  scheduleEndTime: string | null;
}
