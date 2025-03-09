import type { TypeId } from './types';

export function createTypeId<T = unknown>(name?: string): TypeId<NonNullable<T>> {
  const typeId = Symbol(name) as TypeId<NonNullable<T>>;

  return typeId;
}
