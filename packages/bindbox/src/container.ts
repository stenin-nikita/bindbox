import { ActivationError } from './activation-error';
import { Binding } from './binding';
import { BindingBuilder } from './binding-builder';
import { bindingCompare } from './binding-compare';
import { BindingRegistry } from './binding-registry';
import { Cache } from './cache';
import type {
  BindingContract,
  BindingToSyntaxContract,
  ContainerContract,
  ResolutionContextContract,
  ResolutionRequestContract,
  ScopeCallback,
} from './contracts';
import { ErrorFormatter } from './error-formatter';
import type { TokenType, Type, ValueOfType } from './reflection';
import { ResolutionContext } from './resolution-context';
import { ResolutionRequest } from './resolution-request';
import { Scope } from './scope';
import { Target } from './target';

export interface ContainerOptions {
  defaultScope: ScopeCallback<any>;
}

export class Container implements ContainerContract {
  #containerId = Symbol();
  #bindings = new BindingRegistry();
  #cache = new Cache();
  #parent: Container | null = null;
  #options: ContainerOptions;

  constructor(options: Partial<ContainerOptions> = {}) {
    this.#options = {
      defaultScope: Scope.TRANSIENT,
      ...options,
    };
  }

  bind<T>(type: Type<T>): BindingToSyntaxContract<T> {
    const binding = new Binding<T>(this.#containerId, type, this.#options.defaultScope);

    this.#bindings.set(binding.type, binding);

    return new BindingBuilder(binding);
  }

  unbind<T>(type: Type<T>): void {
    const bindings = this.#bindings.get(type);

    if (bindings) {
      this.#bindings.delete(type);

      for (const binding of bindings) {
        this.#cache.release(binding.id);
      }
    }
  }

  rebind<T>(type: Type<T>): BindingToSyntaxContract<T> {
    this.unbind(type);

    return this.bind(type);
  }

  resolve<T>(request: ResolutionRequestContract<T>): T | T[] {
    if (request.target.isArray()) {
      return this.#resolveCollection(request);
    }

    return this.#resolveSingle(request);
  }

  get<T extends TokenType>(type: T): ValueOfType<T> {
    const target = new Target(type);
    const request = new ResolutionRequest(target);
    const result = this.resolve(request);

    return result;
  }

  tryGet<T extends TokenType>(type: T): ValueOfType<T> | undefined {
    try {
      return this.get(type);
    } catch {
      return undefined;
    }
  }

  createContainer(options?: Partial<ContainerOptions>) {
    const child = new Container({
      ...this.#options,
      ...options,
    });

    child.#parent = this;

    return child;
  }

  #resolveSingle<T>(request: ResolutionRequestContract<T>): T {
    const bindings = this.#getBindings(request.target.type);

    let satisfiedBinding: BindingContract<T> | null = null;

    for (let i = 0, len = bindings.length; i < len; i += 1) {
      const binding = bindings[i];

      if (!binding.matches(request)) {
        continue;
      }

      if (satisfiedBinding !== null) {
        if (bindingCompare(satisfiedBinding, binding) === 0) {
          const satisfiedBindings = [satisfiedBinding, binding];

          for (i++; i < len; i++) {
            if (bindings[i].matches(request)) {
              satisfiedBindings.push(bindings[i]);
            }
          }

          throw new ActivationError(
            ErrorFormatter.couldNotUniquelyResolveBinding(request, satisfiedBindings),
          );
        }

        break;
      }

      satisfiedBinding = binding;
    }

    if (!satisfiedBinding) {
      if (request.target.isOptional()) {
        return undefined as T;
      }

      throw new ActivationError(ErrorFormatter.couldNotResolveBinding(request));
    }

    const context = this.#createContext(request, satisfiedBinding);
    const instance = context.resolve();

    return instance;
  }

  #resolveCollection<T>(request: ResolutionRequestContract<T>): T[] {
    const bindings = this.#getBindings(request.target.type);
    const instances: T[] = [];

    for (const binding of bindings) {
      if (!binding.matches(request)) {
        continue;
      }

      const context = this.#createContext(request, binding);
      const instance = context.resolve();

      instances.push(instance);
    }

    if (instances.length === 0 && !request.target.isOptional()) {
      throw new ActivationError(ErrorFormatter.couldNotResolveBinding(request));
    }

    return instances;
  }

  #getBindings<T>(type: Type<T>): BindingContract<T>[] {
    const result: BindingContract<T>[] = [];
    const bindings = this.#bindings.get(type);

    if (bindings) {
      result.push(...bindings);
    }

    if (this.#parent) {
      result.push(...this.#parent.#getBindings(type));
    }

    return result.sort(bindingCompare);
  }

  #createContext<T>(
    request: ResolutionRequestContract<T>,
    binding: BindingContract<T>,
  ): ResolutionContextContract<T> {
    return new ResolutionContext(this, this.#cache, request, binding);
  }
}
