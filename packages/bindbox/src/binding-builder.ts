import type {
  BindingContract,
  BindingOnSyntaxContract,
  BindingToSyntaxContract,
  BindingWhenOrInOrOnSyntaxContract,
  ConditionCallback,
  FactoryCallback,
  ScopeCallback,
} from './contracts';
import { ClassProvider, FactoryProvider, ValueProvider } from './providers';
import type { ConstructorType, Type } from './reflection';
import { Scope } from './scope';
import { assert } from './utils';

export class BindingBuilder<T> implements BindingToSyntaxContract<T> {
  #binding: BindingContract<T>;

  constructor(binding: BindingContract<T>) {
    this.#binding = binding;
  }

  to<TImplementation extends T>(
    concrete: ConstructorType<TImplementation>,
  ): BindingWhenOrInOrOnSyntaxContract<TImplementation> {
    const provider = new ClassProvider<T>(concrete);

    this.#binding.setProvider(provider);

    return this as unknown as BindingWhenOrInOrOnSyntaxContract<TImplementation>;
  }

  toSelf(): BindingWhenOrInOrOnSyntaxContract<T> {
    const concrete = this.#binding.type;

    // TODO: message
    assert(typeof concrete !== 'symbol');

    const provider = new ClassProvider(concrete as ConstructorType<T>);

    this.#binding.setProvider(provider);

    return this;
  }

  toValue<TImplementation extends T>(
    value: TImplementation,
  ): BindingWhenOrInOrOnSyntaxContract<TImplementation> {
    const provider = new ValueProvider<T>(value);

    this.#binding.setProvider(provider);

    return this as unknown as BindingWhenOrInOrOnSyntaxContract<TImplementation>;
  }

  toFactory<TImplementation extends T, TContext>(
    factory: FactoryCallback<TImplementation | T, TContext>,
    thisArg?: TContext,
  ) {
    const provider = new FactoryProvider<T, TContext>(factory, thisArg);

    this.#binding.setProvider(provider);

    return this;
  }

  inTransient() {
    return this.inScope(Scope.TRANSIENT);
  }

  inSingleton() {
    return this.inScope(Scope.SINGLETON);
  }

  inContainer() {
    return this.inScope(Scope.CONTAINER);
  }

  inResolution() {
    return this.inScope(Scope.RESOLUTION);
  }

  inScope(scope: ScopeCallback<T>) {
    this.#binding.setScope(scope);

    return this;
  }

  when(condition: ConditionCallback<T>): BindingOnSyntaxContract<T> {
    this.#binding.setCondition(condition);

    return this;
  }

  whenInjectedInto<U>(type: Type<U>): BindingOnSyntaxContract<T> {
    this.#binding.setCondition((request) => {
      return request.target.requestedBy === type || request.parent?.target.type === type;
    });

    return this;
  }

  onActivation(action: (instance: T) => void) {
    this.#binding.activationActions.add((_context, instance) => action(instance));

    return this;
  }
}
