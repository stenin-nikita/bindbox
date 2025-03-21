import type { TokenType, Type, ValueOfType } from '../reflection';
import type { BindingRootSyntaxContract, FactoryCallback } from './binding-syntax';
import type { ResolutionRequestContract } from './resolution-request';

export interface ContainerContract extends BindingRootSyntaxContract {
  resolve<T>(request: ResolutionRequestContract<T>): T | T[];
  get<T extends TokenType>(type: T): ValueOfType<T>;
  tryGet<T extends TokenType>(type: T): ValueOfType<T> | undefined;
  isBound<T>(type: Type<T>): boolean;
  isBoundCurrent<T>(type: Type<T>): boolean;
  invoke<TResult, TContext>(fn: FactoryCallback<TResult, TContext>, thisArg?: TContext): TResult;
}
