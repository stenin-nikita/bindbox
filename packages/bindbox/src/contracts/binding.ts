import type { Type } from '../reflection';
import type { CacheContract } from './cache';
import type { ProviderContract } from './provider';
import type { ResolutionContextContract } from './resolution-context';
import type { ResolutionRequestContract } from './resolution-request';

export type ConditionCallback<T = unknown> = (request: ResolutionRequestContract<T>) => boolean;

export type Action<T> = (context: ResolutionContextContract<T>, instance: T) => void;

export type ScopeCallback<T = unknown> = (
  context: ResolutionContextContract<T>,
) => CacheContract | null;

export interface BindingContract<T = unknown> {
  readonly id: symbol;
  readonly containerId: symbol;
  readonly type: Type<T>;
  readonly activationActions: Set<Action<T>>;

  cached: T | null;

  setProvider(provider: ProviderContract<T>): void;
  getProvider(): ProviderContract<T>;
  setScope(callback: ScopeCallback<T>): void;
  getScope(context: ResolutionContextContract<T>): CacheContract | null;
  setCondition(condition: ConditionCallback<T>): void;
  hasCondition(): boolean;
  matches(request: ResolutionRequestContract<T>): boolean;
}
