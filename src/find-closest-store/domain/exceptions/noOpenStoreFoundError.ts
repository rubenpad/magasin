export class NoOpenStoreFoundError extends Error {
  constructor() {
    super("No open store is available for the requested location");
    this.name = "NoOpenStoreFoundError";
  }
}
