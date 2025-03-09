import type {
  BindingContract,
  FactoryCallback,
  ResolutionContextContract,
  ResolutionRequestContract,
  TargetContract,
} from './contracts';
import type { Type } from './reflection';

export class ErrorFormatter {
  static formatType<T>(type: Type<T> | FactoryCallback<T>) {
    if (typeof type === 'symbol') {
      return `TypeId<${type.description ?? ''}>`;
    }

    return `Type<${type.name}>`;
  }

  static formatTargetType<T>(target: TargetContract<T>) {
    if (target.isArray()) {
      return `CollectionType<${ErrorFormatter.formatType(target.type)}>`;
    }

    return ErrorFormatter.formatType(target.type);
  }

  static formatBinding<T>(binding: BindingContract<T>) {
    const providerName = binding.getProvider().toString();

    if (binding.hasCondition()) {
      return `conditional ${providerName}`;
    }

    return providerName;
  }

  static formatActivationPath(request: ResolutionRequestContract<any>) {
    const messages: string[] = [];

    let current: ResolutionRequestContract<any> | null = request;

    while (current !== null) {
      messages.push(`${current.depth + 1}) ${ErrorFormatter.formatRequest(current)}`);

      current = current.parent;
    }

    return messages.join('\n');
  }

  static formatRequest(request: ResolutionRequestContract<any>) {
    const formattedType = ErrorFormatter.formatTargetType(request.target);

    if (request.target.requestedBy) {
      const requestedBy = ErrorFormatter.formatType(request.target.requestedBy);

      return `Injection of dependency ${formattedType} into ${requestedBy}`;
    }

    return `Request for ${formattedType}`;
  }

  static couldNotUniquelyResolveBinding<T>(
    request: ResolutionRequestContract<T>,
    satisfiedBindings: BindingContract<T>[],
  ) {
    const messages: string[] = [
      `Error activating ${ErrorFormatter.formatTargetType(request.target)}.`,
      'More than one matching bindings are available.',
      'Matching bindings:',
    ];

    for (let i = 0; i < satisfiedBindings.length; i += 1) {
      messages.push(`  ${i + 1}) ${satisfiedBindings[i].getProvider().toString()}`);
    }

    return messages.join('\n');
  }

  static couldNotResolveBinding<T>(request: ResolutionRequestContract<T>) {
    const formattedType = ErrorFormatter.formatTargetType(request.target);
    const messages: string[] = [
      `Error activating ${formattedType}.`,
      `No matching bindings are available. Ensure that you have defined a binding for ${formattedType}.`,
      'Activation path:',
      ErrorFormatter.formatActivationPath(request),
    ];

    return messages.join('\n');
  }

  static cyclicalDependenciesDetected<T>(context: ResolutionContextContract<T>) {
    const type = ErrorFormatter.formatTargetType(context.request.target);

    const messages: string[] = [
      `Error activating ${type} using ${ErrorFormatter.formatBinding(context.binding)}`,
      'A cyclical dependency was detected between the constructors of two services.\n',
      'Activation path:',
      ErrorFormatter.formatActivationPath(context.request),
    ];

    return messages.join('\n');
  }

  static mispatchParameterCount<T>(
    context: ResolutionContextContract<T>,
    expectedCount: number,
    actualCount: number,
  ) {
    const type = ErrorFormatter.formatTargetType(context.request.target);

    const messages: string[] = [
      `Error activating ${type} using ${ErrorFormatter.formatBinding(context.binding)}`,
      `Mismatch in parameter count: expected ${expectedCount}, but got ${actualCount}. Ensure that the number of constructor arguments matches the number of expected parameters.\n`,
      'Activation path:',
      ErrorFormatter.formatActivationPath(context.request),
    ];

    return messages.join('\n');
  }
}
