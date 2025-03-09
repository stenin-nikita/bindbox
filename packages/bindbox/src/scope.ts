import type { ScopeCallback } from './contracts';

const TransientScopeCallback: ScopeCallback<any> = () => {
  return null;
};

const SingletonScopeCallback: ScopeCallback<any> = (context) => {
  return {
    get() {
      return context.binding.cached;
    },
    release() {
      context.binding.cached = null;
    },
    remember(id, instance) {
      context.binding.cached = instance;
    },
  };
};

const ResolutionScopeCallback: ScopeCallback<any> = (context) => {
  return context.request.resolutionCache;
};

const ContainerScopeCallback: ScopeCallback<any> = (context) => {
  return context.containerCache;
};

export const Scope = {
  TRANSIENT: TransientScopeCallback,
  SINGLETON: SingletonScopeCallback,
  RESOLUTION: ResolutionScopeCallback,
  CONTAINER: ContainerScopeCallback,
};
