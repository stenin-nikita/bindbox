import type { ProviderContract, ResolutionContextContract } from '../contracts';

export class ValueProvider<T> implements ProviderContract<T> {
  #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  create(_context: ResolutionContextContract<T>): T {
    return this.#value;
  }

  toString(): string {
    return 'ValueProvider';
  }
}
