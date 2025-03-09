import type { BindingContract } from './binding';
import type { CacheContract } from './cache';
import type { TargetContract } from './target';

export interface ResolutionRequestContract<T = unknown> {
  readonly target: TargetContract<T>;
  readonly parent: ResolutionRequestContract<unknown> | null;
  readonly children: ResolutionRequestContract[];
  readonly depth: number;
  readonly resolutionCache: CacheContract;
  getActiveBindings(): BindingContract<any>[];
  createRequest<U>(target: TargetContract<U>): ResolutionRequestContract<U>;
}
