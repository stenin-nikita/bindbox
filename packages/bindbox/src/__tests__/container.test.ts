import 'reflect-metadata';
import { describe, expect, it } from 'vitest';

import { Container, ParamTypes, createTypeId, optional } from '../index';

describe('Container', () => {
  it('should be resolved with value provider', () => {
    const container = new Container();
    const TValue = createTypeId<string>('value');

    container.bind(TValue).toValue('value');

    expect(container.get(TValue)).toBe('value');
  });

  it('should be resolved with class provider', () => {
    class Foo {}

    const container = new Container();
    const TFoo = createTypeId<Foo>('Foo');

    container.bind(TFoo).to(Foo);

    expect(container.get(TFoo)).toBeInstanceOf(Foo);
  });

  it('should be resolved with self', () => {
    class Foo {}

    const container = new Container();

    container.bind(Foo).toSelf();

    expect(container.get(Foo)).toBeInstanceOf(Foo);
  });

  it('should be resolved with factory provider', () => {
    const container = new Container();
    const TValue = createTypeId<string>('value');

    container.bind(TValue).toFactory(() => 'value');

    expect(container.get(TValue)).toBe('value');
  });

  it('should be resolve dependency of class', () => {
    const TFoo = createTypeId<Foo>('Foo');
    const TValue = createTypeId<string>('value');

    class Foo {
      constructor(public value: string) {}
    }

    ParamTypes.define(Foo, [TValue]);

    const container = new Container();

    container.bind(TFoo).to(Foo);
    container.bind(TValue).toValue('foo');

    const foo = container.get(TFoo);

    expect(foo.value).toBe('foo');
  });

  it('should be throw error if token is not bound', () => {
    const container = new Container();
    const TValue = createTypeId<string>('value');

    expect(() => {
      container.get(TValue);
    }).toThrow();
  });

  it('should be throw error if dependency of class is not bound', () => {
    const TFoo = createTypeId<Foo>('Foo');
    const TValue = createTypeId<string>('value');

    class Foo {
      constructor(public value: string) {}
    }

    ParamTypes.define(Foo, [TValue]);

    const container = new Container();

    container.bind(TFoo).to(Foo);

    expect(() => {
      container.get(TFoo);
    }).toThrow();
  });

  it('should be resolve from parent container', () => {
    const container = new Container();

    class Foo {}
    const TFoo = createTypeId<Foo>('foo');

    container.bind(TFoo).to(Foo);

    const childContainer = container.createContainer();
    const resolved = childContainer.get(TFoo);

    expect(resolved).toBeInstanceOf(Foo);
  });

  it('should returns singleton instance', () => {
    class Foo {}
    const TFoo = createTypeId<Foo>('foo');

    const container = new Container();

    container.bind(TFoo).to(Foo).inSingleton();

    const first = container.get(TFoo);
    const second = container.get(TFoo);

    expect(first).toBe(second);
  });

  it('should returns singleton instance from child container', () => {
    class Foo {}
    const TFoo = createTypeId<Foo>('foo');

    const container = new Container();
    const childContainer = container.createContainer();

    container.bind(TFoo).to(Foo).inSingleton();

    const rootFoo = container.get(TFoo);
    const childFoo = childContainer.get(TFoo);

    expect(rootFoo).toBe(childFoo);
  });

  it('should returns singleton instance per container', () => {
    class Foo {}
    const TFoo = createTypeId<Foo>('foo');

    const container = new Container();
    const childContainer = container.createContainer();

    container.bind(TFoo).to(Foo).inContainer();

    const rootFoo1 = container.get(TFoo);
    const rootFoo2 = container.get(TFoo);
    const childFoo1 = childContainer.get(TFoo);
    const childFoo2 = childContainer.get(TFoo);

    expect(rootFoo1).toBe(rootFoo2);
    expect(childFoo1).toBe(childFoo2);
    expect(rootFoo1).not.toBe(childFoo1);
  });

  it('should returns singleton instance per resolution', () => {
    class Bar {}
    const TBar = createTypeId<Bar>('bar');
    class Foo {
      constructor(
        public bar1: Bar,
        public bar2: Bar,
      ) {}
    }
    const TFoo = createTypeId<Foo>('foo');

    ParamTypes.define(Foo, [TBar, TBar]);

    const container = new Container();

    container.bind(TBar).to(Bar).inResolution();
    container.bind(TFoo).to(Foo);

    const first = container.get(TFoo);
    const second = container.get(TFoo);

    expect(first.bar1).toBe(first.bar2);
    expect(second.bar1).toBe(second.bar2);
    expect(first.bar1).not.toBe(second.bar1);
  });

  it('should skip error for optional parameter', () => {
    const TFoo = createTypeId<Foo>('foo');
    class Bar {}
    class Foo {
      constructor(public bar?: Bar) {}
    }

    ParamTypes.define(Foo, [optional(Bar)]);

    const container = new Container();

    container.bind(TFoo).to(Foo);

    const resolved = container.get(TFoo);

    expect(resolved.bar).toBe(undefined);
  });

  it('should be resolved collection', () => {
    const TValue = createTypeId<string>();
    const container = new Container();

    container.bind(TValue).toValue('foo');
    container.bind(TValue).toValue('bar');
    container.bind(TValue).toValue('baz');

    const values = container.get([TValue]);

    expect(values).toEqual(['foo', 'bar', 'baz']);
  });

  it('should be throw error for multiple bindings', () => {
    const TValue = createTypeId<string>();
    const container = new Container();

    container.bind(TValue).toValue('foo');
    container.bind(TValue).toValue('bar');
    container.bind(TValue).toValue('baz');

    expect(() => {
      container.get(TValue);
    }).toThrow();
  });

  it('should be resolved with rebound value', () => {
    const TValue = createTypeId<string>();
    const container = new Container();

    container.bind(TValue).toValue('foo');
    container.rebind(TValue).toValue('bar');

    const resolved = container.get(TValue);

    expect(resolved).toBe('bar');
  });

  it('should be throw error for unbound value', () => {
    const TValue = createTypeId<string>();
    const container = new Container();

    container.bind(TValue).toValue('foo');
    container.unbind(TValue);

    expect(() => {
      container.get(TValue);
    }).toThrow();
  });

  it('should be throw error for cyclic dependencies', () => {
    class A {
      constructor(public b: B) {}
    }
    class B {
      constructor(public c: C) {}
    }
    class C {
      constructor(public a: A) {}
    }

    ParamTypes.define(A, [B]);
    ParamTypes.define(B, [C]);
    ParamTypes.define(C, [A]);

    const container = new Container();

    container.bind(A).toSelf();
    container.bind(B).toSelf();
    container.bind(C).toSelf();

    expect(() => {
      container.get(A);
    }).toThrow();
  });

  describe('isBoundCurrent', () => {
    it('should be bound to current container', () => {
      class Foo {}

      const container = new Container();

      container.bind(Foo).toSelf();

      expect(container.isBoundCurrent(Foo)).toBe(true);
    });

    it('should not be bound to parent container', () => {
      class Foo {}

      const container = new Container();
      const childContainer = container.createContainer();

      container.bind(Foo).toSelf();

      expect(container.isBoundCurrent(Foo)).toBe(true);
      expect(childContainer.isBoundCurrent(Foo)).toBe(false);
    });

    it('should not be bound in container', () => {
      class Foo {}

      const container = new Container();

      expect(container.isBoundCurrent(Foo)).toBe(false);
    });
  });

  describe('isBound', () => {
    it('should be bound to current container', () => {
      class Foo {}

      const container = new Container();

      container.bind(Foo).toSelf();

      expect(container.isBound(Foo)).toBe(true);
    });

    it('should be bound to parent container', () => {
      class Foo {}

      const container = new Container();
      const childContainer = container.createContainer();

      container.bind(Foo).toSelf();

      expect(childContainer.isBound(Foo)).toBe(true);
    });

    it('should not be bound in container', () => {
      class Foo {}

      const container = new Container();

      expect(container.isBound(Foo)).toBe(false);
    });
  });
});
