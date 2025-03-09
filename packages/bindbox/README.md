# 📦 BindBox

**BindBox** is a dependency injection container.

## Installation

```shell
npm i bindbox reflect-metadata
```

## Example

```ts
import { Container, ParamTypes, createTypeId } from 'bindbox';
import 'reflect-metadata';

// contracts
export interface LoggerContract {
  log(message: string): void;
}

export interface StorageContract {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

// implementations
export class Logger implements LoggerContract {
  log(message: string): void {
    console.log(message);
  }
}

export class LocalStorage implements StorageContract {
  constructor(private logger: LoggerContract) {
    this.logger.log('LocalStorage inited');
  }

  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

export class MemoryStorage implements StorageContract {
  #data = new Map<string, string>();

  constructor(private logger: LoggerContract) {
    this.logger.log('MemoryStorage inited');
  }

  get(key: string): string | null {
    return this.#data.get(key) ?? null;
  }

  set(key: string, value: string): void {
    this.#data.set(key, value);
  }

  remove(key: string): void {
    this.#data.delete(key);
  }
}

// tokens
export const TStorage = createTypeId<StorageContract>('Storage');
export const TLogger = createTypeId<LoggerContract>('Logger');

// annotations
ParamTypes.define(LocalStorage, [TLogger]);
ParamTypes.define(MemoryStorage, [TLogger]);

// usage

const container = new Container();

container.bind(TStorage).to(MemoryStorage).inSingleton();
container.bind(TLogger).to(Logger).inSingleton();

const storage = container.get(TStorage);

storage.set('some', 'value');
```
