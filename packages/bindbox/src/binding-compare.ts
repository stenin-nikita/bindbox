import type { BindingContract } from './contracts';

export function bindingCompare<T>(a: BindingContract<T>, b: BindingContract<T>) {
  if (a === b) {
    return 0;
  }

  if (a.containerId !== b.containerId) {
    return 1;
  }

  const aCondition = a.hasCondition() ? 1 : -1;
  const bCondition = b.hasCondition() ? 1 : -1;

  return aCondition - bCondition;
}
