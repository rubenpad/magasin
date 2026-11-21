import { JobName } from "../../../../store-search-request/infrastructure/adapters/in/queue";

export interface QueuePort {
  add<T>(name: JobName, data: T): Promise<void>;
}
