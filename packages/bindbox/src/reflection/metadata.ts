import type { CollectionType, Metadata, MetadataType, Type } from './types';

type OptionalType<TType, TOptional extends boolean | void> = TOptional extends true
  ? TType | undefined
  : TOptional extends false
    ? NonNullable<TType>
    : TType;

export function isMetadataType<T>(
  type: Type<T> | MetadataType<T> | CollectionType<T>,
): type is MetadataType<T> {
  return typeof type === 'object' && type !== null && 'target' in type && 'metadata' in type;
}

export function withMetadata<TType, TMetadata extends Metadata>(
  type: Type<TType> | MetadataType<TType>,
  metadata: TMetadata,
): MetadataType<OptionalType<TType, TMetadata['optional']>> {
  const isMetadata = isMetadataType(type);
  const target: Type<any> = isMetadata ? type.target : type;
  const data = isMetadata ? { ...type.metadata, ...metadata } : metadata;

  return { target, metadata: data };
}
