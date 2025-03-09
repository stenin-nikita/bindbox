import type { FactoryCallback, ResolutionContextContract, TargetContract } from './contracts';
import {
  type AbstractType,
  type CollectionType,
  type ConstructorType,
  type Metadata,
  type MetadataType,
  type Type,
  type TypeId,
  withMetadata,
} from './reflection';

export class Target<T = unknown> implements TargetContract<T> {
  #type: AbstractType<T> | TypeId<T>;
  #metadata: Metadata;
  #isArray: boolean;
  #requestedBy: ConstructorType<unknown> | FactoryCallback<unknown> | null;

  constructor(
    type: Type<T> | MetadataType<T> | CollectionType<T>,
    requestedBy: ConstructorType<unknown> | FactoryCallback<unknown> | null = null,
  ) {
    const isArray = Array.isArray(type);
    const { target, metadata } = withMetadata(isArray ? type[0] : type, {});

    this.#isArray = isArray;
    this.#type = target;
    this.#metadata = metadata;
    this.#requestedBy = requestedBy;
  }

  get type(): AbstractType<T> | TypeId<T> {
    return this.#type;
  }

  get requestedBy(): ConstructorType<unknown> | FactoryCallback<unknown> | null {
    return this.#requestedBy;
  }

  getMetadata(): Metadata {
    return this.#metadata;
  }

  isArray(): boolean {
    return this.#isArray;
  }

  isOptional(): boolean {
    return Boolean(this.#metadata.optional);
  }

  resolveWithin<TParent>(context: ResolutionContextContract<TParent>): T | T[] {
    const { container, request } = context;
    const childRequest = request.createRequest(this);

    return container.resolve(childRequest);
  }
}
