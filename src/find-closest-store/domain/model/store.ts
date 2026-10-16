export interface Store {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
}
