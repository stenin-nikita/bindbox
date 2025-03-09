import { type TargetParameterTypes, type TargetType, defineParamTypes } from './param-types';

export function ParamTypes<T extends TargetType>(...params: TargetParameterTypes<T>) {
  function Decorator(target: T) {
    defineParamTypes(target, params);

    return target;
  }

  return Decorator;
}

ParamTypes.define = defineParamTypes;
