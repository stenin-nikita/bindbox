import type { CacheContract } from './contracts';

export class Cache implements CacheContract {
  #entries = new Map<symbol, unknown>();

  entries() {
    return this.#entries.entries();
  }

  get<T>(id: symbol): T | null {
    const instance = this.#entries.get(id) as T | undefined;

    return instance ?? null;
  }

  remember<T>(id: symbol, instance: T): void {
    this.#entries.set(id, instance);
  }

  release<T>(id: symbol): void {
    this.#entries.delete(id);
  }
}
