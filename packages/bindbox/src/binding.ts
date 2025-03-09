import type {
  Action,
  BindingContract,
  CacheContract,
  ConditionCallback,
  ProviderContract,
  ResolutionContextContract,
  ResolutionRequestContract,
  ScopeCallback,
} from './contracts';
import type { Type } from './reflection';
import { assert } from './utils';

export class Binding<T = unknown> implements BindingContract<T> {
  #id: symbol;
  #containerId: symbol;
  #type: Type<T>;
  #provider: ProviderContract<T> | null = null;
  #scopeCallback: ScopeCallback<T>;
  #condition: ConditionCallback<T> | null = null;
  #activationActions = new Set<Action<T>>();

  cached: T | null = null;

  constructor(containerId: symbol, type: Type<T>, scopeCallback: ScopeCallback<T>) {
    this.#id = Symbol();
    this.#containerId = containerId;
    this.#type = type;
    this.#scopeCallback = scopeCallback;
  }

  get id(): symbol {
    return this.#id;
  }

  get containerId(): symbol {
    return this.#containerId;
  }

  get type(): Type<T> {
    return this.#type;
  }

  get activationActions(): Set<Action<T>> {
    return this.#activationActions;
  }

  setCondition(condition: ConditionCallback<T>): void {
    this.#condition = condition;
  }

  hasCondition(): boolean {
    return this.#condition !== null;
  }

  matches(request: ResolutionRequestContract<T>): boolean {
    return this.#condition ? this.#condition(request) : true;
  }

  setProvider(provider: ProviderContract<T>): void {
    this.#provider = provider as ProviderContract<T>;
  }

  getProvider(): ProviderContract<T> {
    // TODO: add error message
    assert(this.#provider);

    return this.#provider;
  }

  setScope(callback: ScopeCallback<T>): void {
    this.#scopeCallback = callback;
  }

  getScope(context: ResolutionContextContract<T>): CacheContract | null {
    return this.#scopeCallback(context);
  }
}
