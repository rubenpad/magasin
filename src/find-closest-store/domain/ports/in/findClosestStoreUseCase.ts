import { Store } from '../../model/store';

export interface FindClosestStoreUseCase {
  execute(): Promise<Store>;
}