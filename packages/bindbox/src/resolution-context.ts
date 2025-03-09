import { ActivationError } from './activation-error';
import type {
  BindingContract,
  CacheContract,
  ContainerContract,
  ResolutionContextContract,
  ResolutionRequestContract,
} from './contracts';
import { ErrorFormatter } from './error-formatter';

export class ResolutionContext<T = unknown> implements ResolutionContextContract<T> {
  #container: ContainerContract;
  #containerCache: CacheContract;
  #request: ResolutionRequestContract<T>;
  #binding: BindingContract<T>;

  constructor(
    container: ContainerContract,
    containerCache: CacheContract,
    request: ResolutionRequestContract<T>,
    binding: BindingContract<T>,
  ) {
    this.#container = container;
    this.#containerCache = containerCache;
    this.#request = request;
    this.#binding = binding;
  }

  get binding(): BindingContract<T> {
    return this.#binding;
  }

  get container(): ContainerContract {
    return this.#container;
  }

  get request(): ResolutionRequestContract<T> {
    return this.#request;
  }

  resolve(): T {
    const activeBindings = this.#request.getActiveBindings();

    if (activeBindings.includes(this.#binding)) {
      throw new ActivationError(ErrorFormatter.cyclicalDependenciesDetected(this));
    }

    const scope = this.#binding.getScope(this);

    return this.#resolveInternal(scope);
  }

  get containerCache(): CacheContract {
    return this.#containerCache;
  }

  #resolveInternal(scope: CacheContract | null) {
    if (scope !== null) {
      const cachedInstance = scope.get<T>(this.#binding.id);

      if (cachedInstance !== null) {
        return cachedInstance;
      }
    }

    this.#request.getActiveBindings().push(this.#binding);

    const provider = this.#binding.getProvider();
    const instance = provider.create(this);

    return this.#afterInstanceResolved(scope, instance);
  }

  #afterInstanceResolved(scope: CacheContract | null, instance: T) {
    this.#request.getActiveBindings().pop();

    if (scope) {
      scope.remember(this.#binding.id, instance);
    }

    try {
      for (const action of this.#binding.activationActions) {
        action(this, instance);
      }
    } catch (err) {
      if (scope) {
        scope.release(this.#binding.id);
      }

      throw err;
    }

    return instance;
  }
}
