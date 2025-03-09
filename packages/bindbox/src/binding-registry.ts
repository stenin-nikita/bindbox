import type { BindingContract } from './contracts';
import type { Type } from './reflection';

export class BindingRegistry {
  #entries = new Map<Type, Set<BindingContract<any>>>();

  set<T>(type: Type<T>, binding: BindingContract<T>) {
    const bindings = this.#entries.get(type);

    if (bindings) {
      bindings.add(binding);
    } else {
      this.#entries.set(type, new Set([binding]));
    }
  }

  get<T>(key: Type<T>): Set<BindingContract<T>> | undefined {
    return this.#entries.get(key);
  }

  has<T>(key: Type<T>, value?: BindingContract<T>) {
    if (typeof value === 'undefined') {
      return this.#entries.has(key);
    }

    const bindings = this.#entries.get(key);

    return bindings?.has(value) ?? false;
  }

  delete<T>(key: Type<T>, value?: BindingContract<T>) {
    if (typeof value === 'undefined') {
      return this.#entries.delete(key);
    }

    const bindings = this.#entries.get(key);

    if (bindings) {
      return bindings.delete(value);
    }

    return false;
  }
}
