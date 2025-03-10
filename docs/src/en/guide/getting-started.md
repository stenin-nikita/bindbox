# Getting Started

Follow these simple steps to quickly start using `bindbox` in your application.

## Installation

You can install `bindbox` using the JavaScript package manager:

::: code-group

```sh [npm]
npm add bindbox reflect-metadata
```

```sh [pnpm]
pnpm add bindbox reflect-metadata
```

```sh [yarn]
yarn add bindbox reflect-metadata
```

```sh [bun]
bun add bindbox reflect-metadata
```

:::

> [!TIP] Compatibility Note
> Please ensure that [Node.js](https://nodejs.org/) version 18 or higher is installed in your project.

## Usage

Below is a brief example highlighting the basic capabilities of the DI container. For more detailed information, please refer to the subsequent sections of the documentation.

::: code-group

```ts [main.ts]
import { Container } from 'bindbox';
import 'reflect-metadata';

import { Logger } from './logger';
import { Storage } from './storage';
import { TLogger, TStorage } from './tokens';

const container = new Container();

container.bind(TLogger).to(Logger).inSingleton();
container.bind(TStorage).to(Storage).inSingleton();

const storage = container.get(TStorage);

storage.set('some', 'value');
```

```ts [contracts.ts]
export interface LoggerContract {
  log(message: string): void;
}

export interface StorageContract {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}
```

```ts [tokens.ts]
import type { LoggerContract, StorageContract } from './contracts';

export const TLogger = createTypeId<LoggerContract>('TLogger');
export const TStorage = createTypeId<StorageContract>('TStorage');
```

```ts [storage.ts]
import { ParamTypes } from 'bindbox';

import type { StorageContract } from './contracts';
import type { TLogger } from './tokens';

export class Storage implements StorageContract {
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

ParamTypes.define(Storage, [TLogger]);
```

```ts [logger.ts]
import type { LoggerContract } from './contracts';

export class Logger implements LoggerContract {
  log(message: string): void {
    console.log(message);
  }
}
```

:::
