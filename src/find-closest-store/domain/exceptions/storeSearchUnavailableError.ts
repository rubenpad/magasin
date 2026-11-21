export class StoreSearchUnavailableError extends Error {
  constructor(options?: { cause?: unknown }) {
    super("Store search is unavailable", options);
    this.name = "StoreSearchUnavailableError";
  }
}
