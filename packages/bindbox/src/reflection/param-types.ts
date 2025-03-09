import { METADATA_KEY } from './constants';
import type { AbstractType, Func, ParameterTypes } from './types';

type InferParameters<T> =
  T extends Func<infer P> ? P : T extends AbstractType ? ConstructorParameters<T> : never;

export type TargetType = Func | AbstractType;

export type TargetParameterTypes<T extends AbstractType | Func> = ParameterTypes<
  InferParameters<T>
>;

export function defineParamTypes<TTarget extends TargetType>(
  target: TTarget,
  paramTypes: TargetParameterTypes<TTarget>,
): TTarget {
  Reflect.defineMetadata(METADATA_KEY.PARAM_TYPES, paramTypes, target);

  return target;
}

export function getParamTypes<TTarget extends TargetType>(
  target: TTarget,
): TargetParameterTypes<TTarget> {
  const paramTypes = Reflect.getMetadata(METADATA_KEY.PARAM_TYPES, target);

  return (paramTypes ?? []) as TargetParameterTypes<TTarget>;
}
