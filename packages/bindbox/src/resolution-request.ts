import { Cache } from './cache';
import type {
  BindingContract,
  CacheContract,
  ResolutionRequestContract,
  TargetContract,
} from './contracts';

export class ResolutionRequest<T = unknown> implements ResolutionRequestContract<T> {
  #target: TargetContract<T>;
  #parent: ResolutionRequest<unknown> | null = null;
  #depth = 0;
  #activeBindings: BindingContract<unknown>[] = [];
  #resolutionCache: CacheContract;
  #children: ResolutionRequest[];

  constructor(target: TargetContract<T>, parent: ResolutionRequest<unknown> | null = null) {
    this.#target = target;
    this.#parent = parent;
    this.#depth = parent ? parent.#depth + 1 : 0;
    this.#activeBindings = parent ? parent.#activeBindings.slice() : [];
    this.#resolutionCache = parent ? parent.#resolutionCache : new Cache();
    this.#children = [];
  }

  get target(): TargetContract<T> {
    return this.#target;
  }

  get depth(): number {
    return this.#depth;
  }

  get parent(): ResolutionRequestContract<unknown> | null {
    return this.#parent;
  }

  get resolutionCache() {
    return this.#resolutionCache;
  }

  get children() {
    return this.#children;
  }

  getActiveBindings(): BindingContract<unknown>[] {
    return this.#activeBindings;
  }

  createRequest<TTarget>(target: TargetContract<TTarget>): ResolutionRequestContract<TTarget> {
    const child = new ResolutionRequest(target, this);

    this.children.push(child);

    return child;
  }
}
