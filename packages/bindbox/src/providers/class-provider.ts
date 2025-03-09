import { ActivationError } from '../activation-error';
import type { ProviderContract, ResolutionContextContract } from '../contracts';
import { ErrorFormatter } from '../error-formatter';
import { type ConstructorType, type ParameterType, getParamTypes } from '../reflection';
import { Target } from '../target';

export class ClassProvider<T> implements ProviderContract<T> {
  #concrete: ConstructorType<T>;

  constructor(concrete: ConstructorType<T>) {
    this.#concrete = concrete;
  }

  create(context: ResolutionContextContract<T>): T {
    const paramTypes = getParamTypes(this.#concrete);

    const actualCount = paramTypes.length;
    const expectedCount = this.#concrete.length;

    if (expectedCount > actualCount) {
      throw new ActivationError(
        ErrorFormatter.mispatchParameterCount(context, expectedCount, actualCount),
      );
    }

    const parameters = this.#resolveValues(context, paramTypes);

    return Reflect.construct(this.#concrete, parameters);
  }

  #resolveValues(context: ResolutionContextContract<T>, paramTypes: ParameterType[]) {
    return paramTypes.map((paramType) => {
      const target = new Target(paramType, this.#concrete);

      return target.resolveWithin(context);
    });
  }

  toString(): string {
    return `ClassProvider<${this.#concrete.name}>`;
  }
}
