import type { AbstractType, ConstructorType, Metadata, TypeId } from '../reflection';
import type { FactoryCallback } from './binding-syntax';
import type { ResolutionContextContract } from './resolution-context';

export interface TargetContract<T> {
  readonly type: AbstractType<T> | TypeId<T>;
  readonly requestedBy: ConstructorType<unknown> | FactoryCallback<unknown> | null;
  isArray(): boolean;
  isOptional(): boolean;
  getMetadata(): Metadata;
  resolveWithin<TParent = unknown>(parent: ResolutionContextContract<TParent>): T | T[];
}
