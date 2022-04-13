import React, { Reducer } from 'react';
import { populateComputedState, IsFormValidFn, selectFullState } from '../helpers/form-helpers';
import {
  FormikMessage,
  FormikReducerState,
  FormikState,
} from '../types';
import {
  Selector,
  Comparer,
  useOptimizedSelector,
} from 'use-optimized-selector';
import { useEventCallback } from './useEventCallback';
import { BatchCallback, getBatch } from '../helpers/batch-helpers';
import { useFormikSubscription } from './useFormikSubscription';

export const useFormikSubscriptionsContainer = <Values>(
  initialState: FormikReducerState<Values>,
  formikReducer: Reducer<FormikReducerState<Values>, FormikMessage<Values>>,
  isFormValid: IsFormValidFn<Values>
) => {
  /**
   * A list of callbacks for updating subscriptions.
   * These should only be updated during a batch when using React-Dom / React-Native renderers.
   */
  const subscriptionsRef = React.useRef<Function[]>([]);

  /**
   * StateRef contains only the Reducer State.
   * Not computed state like isDirty, isValid.
   */
  const stateRef = React.useRef<FormikReducerState<Values>>(initialState);

  /**
   * Get computed state from current reducer state.
   * Note: this creates a new computedState,
   * and should only be used to update computedStateRef.
   *
   * Use computedStateRef to access the value.
   */
  const getComputedState = useEventCallback(
    () => populateComputedState(isFormValid, stateRef.current),
  );

  // Don't call getComputedState on every render.
  const computedStateRef = React.useRef(React.useMemo(() => getComputedState(), []));

  /**
   * Get latest state. Does not recreate state,
   * but uses previously computed state created by dispatch.
   */
  const getState = React.useCallback(() => computedStateRef.current, [computedStateRef]);
  
  const subscribe = React.useCallback((callback: Function) => {
    subscriptionsRef.current.push(callback);

    return () => {
      subscriptionsRef.current = subscriptionsRef.current.filter(
        (cb: Function) => cb !== callback
      );
    }
  }, [subscriptionsRef]);

  /**
   * Update Subscriptions using RenderState.
   */
  const useState = React.useCallback(
    <Return>(
      selector: Selector<FormikState<Values>, Return> = selectFullState as any,
      comparer: Comparer<Return> = Object.is,
      shouldSubscribe: boolean = true
    ) => {
      selector = useOptimizedSelector(selector, comparer);
      
      const getCurrentValue = React.useCallback(() => selector(getState()), [selector, getState]);
      const subscribeFn = React.useMemo(() => shouldSubscribe ? subscribe : () => () => { }, [shouldSubscribe, subscribe]);
            
      return useFormikSubscription(getCurrentValue, subscribeFn);
    },
    [subscriptionsRef, computedStateRef, getState, subscribe]
  );

  /**
   * Make sure to batch updates to subscriptions.
   */
  const batch = React.useCallback((callback: BatchCallback) => {
    getBatch()(callback);
  }, []);

  /**
   * Each call to dispatch _immediately_ updates the ref.
   * It also batches updates to all subscribers.
   */
  const dispatch = React.useCallback(
    (msg: FormikMessage<Values>) => {
      stateRef.current = formikReducer(stateRef.current, msg);
      // calculate computed state once on each dispatch,
      // so it can be reused across subscriptions
      computedStateRef.current = getComputedState();

      batch(() => {
        subscriptionsRef.current.forEach(callback => callback());
      })
    },
    [stateRef]
  );

  return {
    useState,
    getState: getComputedState,
    subscribe,
    dispatch
  }
};
