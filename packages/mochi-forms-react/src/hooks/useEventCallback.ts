import { useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export type EventCallbackFn<Args extends unknown[], Return> = (
  ...args: Args
) => Return;

// Typed using a function identity
export function useEventCallback<CallbackFn>(
  fn: CallbackFn extends (...args: infer Args) => infer Return
    ? EventCallbackFn<Args, Return>
    : never
): CallbackFn extends (...args: infer Args) => infer Return
  ? EventCallbackFn<Args, Return>
  : never;
// Typed using Args and Return
// This is how Typescript will infer the callback's value
export function useEventCallback<Args extends unknown[], Return>(
  fn: EventCallbackFn<Args, Return>
): EventCallbackFn<Args, Return>;

export function useEventCallback<Args extends unknown[], Return>(
  fn: EventCallbackFn<Args, Return>
): EventCallbackFn<Args, Return> {
  const ref = useRef(fn);

  // we copy a ref to the callback scoped to the current state/props on each render
  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: Args) => ref.current.apply(void 0, args), []);
}
