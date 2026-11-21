export interface JoinedStoreScheduleRow {
  storeId: string;
  storeName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  distanceMeters: number;
  scheduleId: string;
  scheduleDayOfWeek: number;
  scheduleStartTime: string;
  scheduleEndTime: string;
}
