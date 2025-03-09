export class AssertError extends Error {}

export function assert(condition: any, message = 'Assertion failed'): asserts condition {
  if (!condition) {
    throw new AssertError(message);
  }
}
