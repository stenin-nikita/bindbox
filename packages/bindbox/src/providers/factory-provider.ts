import { ActivationError } from '../activation-error';
import type { FactoryCallback, ProviderContract, ResolutionContextContract } from '../contracts';
import { ErrorFormatter } from '../error-formatter';
import { type ParameterType, getParamTypes } from '../reflection';
import { Target } from '../target';

export class FactoryProvider<T, R = any> implements ProviderContract<T> {
  #factory: FactoryCallback<T, R>;

  #thisArg?: R;

  constructor(factory: FactoryCallback<T, R>, thisArg?: R) {
    this.#factory = factory;
    this.#thisArg = thisArg;
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

    return Reflect.apply(this.#factory, this.#thisArg, parameters);
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
