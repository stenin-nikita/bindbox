import type { BindingContract } from './binding';
import type { CacheContract } from './cache';
import type { ContainerContract } from './container';
import type { ResolutionRequestContract } from './resolution-request';

export interface ResolutionContextContract<T = unknown> {
  readonly binding: BindingContract<T>;
  readonly container: ContainerContract;
  readonly containerCache: CacheContract;
  readonly request: ResolutionRequestContract<T>;
  resolve(): T;
}
