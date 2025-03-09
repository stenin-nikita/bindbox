import type { ResolutionContextContract } from './resolution-context';

export interface ProviderContract<T = unknown> {
  create(context: ResolutionContextContract<T>): T;

  toString(): string;
}
