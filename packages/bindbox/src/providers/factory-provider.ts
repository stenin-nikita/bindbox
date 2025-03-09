import { ActivationError } from '../activation-error';
import type { FactoryCallback, ProviderContract, ResolutionContextContract } from '../contracts';
import { ErrorFormatter } from '../error-formatter';
import { type ParameterType, getParamTypes } from '../reflection';
import { Target } from '../target';

export class FactoryProvider<T> implements ProviderContract<T> {
  #factory: FactoryCallback<T>;

  constructor(factory: FactoryCallback<T>) {
    this.#factory = factory;
  }

  create(context: ResolutionContextContract<T>): T {
    const paramTypes = getParamTypes(this.#factory);

    const actualCount = paramTypes.length;
    const expectedCount = this.#factory.length;

    if (expectedCount > actualCount) {
      throw new ActivationError(
        ErrorFormatter.mispatchParameterCount(context, expectedCount, actualCount),
      );
    }

    const parameters = this.#resolveValues(context, paramTypes);

    return Reflect.apply(this.#factory, null, parameters);
  }

  #resolveValues(context: ResolutionContextContract<T>, paramTypes: ParameterType[]) {
    return paramTypes.map((paramType) => {
      const target = new Target(paramType, this.#factory);

      return target.resolveWithin(context);
    });
  }

  toString(): string {
    return `FactoryProvider<${this.#factory.name}>`;
  }
}
