export type AbstractType<T = any> = abstract new (...args: any[]) => T;

export type ConstructorType<T = any> = new (...args: any[]) => T;

export type TypeId<T = any> = symbol & {
  readonly TYPE: T;
};

export type Type<T = any> = AbstractType<T> | TypeId<T>;

export interface Metadata {
  optional?: boolean;
  [key: string]: unknown;
}

export interface MetadataType<T = any> {
  target: Type<T>;
  metadata: Metadata;
}

export type CollectionType<T = any> = [type: Type<T> | MetadataType<T | undefined>];

export type TokenType<T = any> = Type<T> | CollectionType<T> | MetadataType<T>;

export type Func<TArgs extends any[] = any[], TReturn = any, TContext = any> = (
  this: TContext,
  ...args: TArgs
) => TReturn;

export type ParameterType<T = any> =
  NonNullable<T> extends Array<infer P>
    ? Type<T> | MetadataType<T> | CollectionType<P>
    : Type<T> | MetadataType<T>;

export type ParameterTypes<T extends unknown[]> = T extends unknown[]
  ? {
      [P in keyof T]-?: ParameterType<T[P]>;
    }
  : never;

export type ValueOfType<T extends TokenType> =
  T extends CollectionType<infer P>
    ? Array<NonNullable<P>>
    : T extends TokenType<infer P>
      ? P
      : never;
