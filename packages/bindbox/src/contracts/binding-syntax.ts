import type { ConstructorType, Type } from '../reflection';
import type { ConditionCallback, ScopeCallback } from './binding';

export type FactoryCallback<T> = (this: null, ...args: any[]) => T;

export interface BindingOnSyntaxContract<T> {
  onActivation(action: (instance: T) => void): BindingOnSyntaxContract<T>;
}

export interface BindingRootSyntaxContract {
  bind<T>(type: Type<T>): BindingToSyntaxContract<T>;
  unbind<T>(type: Type<T>): void;
  rebind<T>(type: Type<T>): BindingToSyntaxContract<T>;
}

export interface BindingToSyntaxContract<TAbstract> {
  to<TImpl extends TAbstract>(
    concrete: ConstructorType<TImpl>,
  ): BindingWhenOrInOrOnSyntaxContract<TImpl>;
  toSelf(): BindingWhenOrInOrOnSyntaxContract<TAbstract>;
  toValue<TImplementation extends TAbstract>(
    value: TImplementation,
  ): BindingWhenOrInOrOnSyntaxContract<TImplementation>;
  toFactory<TImplementation extends TAbstract>(
    factory: FactoryCallback<TImplementation | TAbstract>,
  ): BindingWhenOrInOrOnSyntaxContract<TImplementation | TAbstract>;
}

export interface BindingInSyntaxContract<T> {
  inTransient(): BindingWhenOrOnSyntaxContract<T>;
  inSingleton(): BindingWhenOrOnSyntaxContract<T>;
  inContainer(): BindingWhenOrOnSyntaxContract<T>;
  inResolution(): BindingWhenOrOnSyntaxContract<T>;
  inScope(scope: ScopeCallback<T>): BindingWhenOrOnSyntaxContract<T>;
}

export interface BindingWhenSyntaxContract<T> {
  when(condition: ConditionCallback<T>): BindingOnSyntaxContract<T>;
  whenInjectedInto<U>(type: Type<U>): BindingOnSyntaxContract<T>;
}

export interface BindingWhenOrOnSyntaxContract<T>
  extends BindingWhenSyntaxContract<T>,
    BindingOnSyntaxContract<T> {}

export interface BindingWhenOrInOrOnSyntaxContract<T>
  extends BindingWhenSyntaxContract<T>,
    BindingInSyntaxContract<T>,
    BindingOnSyntaxContract<T> {}
