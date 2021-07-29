import { useMemo, useReducer, useRef } from 'react';

export default function useProxy<T extends object>(target: T) {
  const targetRef = useRef(target);
  const [, forceUpdate] = useReducer(() => [], []);
  const targetProxy = useMemo<T>(() => {
    const handler: ProxyHandler<T> = {
      get(target, propertyKey, receiver) {
        const propertyValue = Reflect.get(target, propertyKey, receiver);
        if (typeof propertyValue === 'object' && propertyValue !== null) {
          return new Proxy(propertyValue, handler);
        } else {
          return propertyValue;
        }
      },
      set(target, propertyKey, value, receiver) {
        const flag = Reflect.set(target, propertyKey, value, receiver);
        forceUpdate();
        return flag;
      },
    };
    return new Proxy(targetRef.current, handler);
  }, [forceUpdate]);
  return targetProxy;
}
