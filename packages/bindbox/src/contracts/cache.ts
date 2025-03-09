export interface CacheContract {
  get<T>(id: symbol): T | null;
  remember<T>(id: symbol, instance: T): void;
  release<T>(id: symbol): void;
}
