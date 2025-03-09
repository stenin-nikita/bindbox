import { withMetadata } from './metadata';
import type { MetadataType, Type } from './types';

export function optional<T>(type: Type<T> | MetadataType<T>): MetadataType<T | undefined> {
  return withMetadata(type, { optional: true });
}
