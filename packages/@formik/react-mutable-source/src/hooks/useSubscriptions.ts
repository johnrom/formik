import {
  useCheckableEventCallback,
  useIsomorphicLayoutEffect,
} from '@formik/core';
import { MutableRefObject, useMemo, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import {
  selectCreateSelector,
  selectGetSelector,
  getOrCreateSubscription,
  getSubscription,
  selectCreateSubscription,
  CreateSelectorFn,
  CreateSubscriberFn,
  GetSelectorFn,
  SliceFn,
  Subscriber,
  selectCreateSubscriber,
} from '../helpers/subscription-helpers';
import {
  // eslint-disable-next-line
  // @ts-ignore
  unstable_createMutableSource as createMutableSource,
  // eslint-disable-next-line
  // @ts-ignore
  unstable_useMutableSource as useMutableSource,
} from 'react';

export type SubscriptionApi<State> = {
  mutableSource: MutableSource;
  getSubscribeFn: SubscribeFn<State>;
  getSelector: GetSelectorFn<State>;
  createSelector: CreateSelectorFn<State>;
  createSubscriber: CreateSubscriberFn<State>;
};

export type MutableSource = any;
export type SubscriptionCallback = () => void;
export type MutableSubscribeFn<State> = (
  source: State,
  callback: SubscriptionCallback
) => UnsubscribeFn;

export type SubscribeFn<State> = <Args extends any[], Return>(
  newSubscriber: Subscriber<State, Args, Return>
) => MutableSubscribeFn<State>;
export type UnsubscribeFn = () => void;

export interface Subscription<State, Args extends any[], Return> {
  subscriber: Subscriber<State, Args, Return>;
  selector: SliceFn<State, Return>;
  listeners: SubscriptionCallback[];
  prevStateRef: MutableRefObject<Return>;
}

export const useSubscriptions = <State>(
  stateRef: MutableRefObject<State>,
  committedState: State
) => {
  const subscriptionsRef = useRef<Subscription<State, any, any>[]>([]);
  const mutableSource = useMemo(
    () => createMutableSource(stateRef, () => stateRef.current),
    [stateRef]
  );

  const getSelector: GetSelectorFn<State> = useMemo(
    () => selectGetSelector(),
    []
  );

  // these selectors need some help inferring
  const createSelector: CreateSelectorFn<State> = useMemo(
    () => selectCreateSelector<State>(),
    []
  );

  const createSubscriber: CreateSubscriberFn<State> = useMemo(
    () => selectCreateSubscriber<State>(),
    []
  );

  const createSubscription = useCheckableEventCallback(
    () => selectCreateSubscription(stateRef.current, getSelector),
    [getSelector, stateRef]
  );

  // TypeScript needs help inferring these generics.
  //
  // We tell useMutableSource to update when we detect a change, not _always_
  //
  const getSubscribeFn: <Args extends any[], Return>(
    newSubscriber: Subscriber<State, Args, Return>
  ) => MutableSubscribeFn<State> = useCheckableEventCallback(
    () => <Args extends any[], Return>(
      newSubscriber: Subscriber<State, Args, Return>
    ): MutableSubscribeFn<State> => (_source, callback) => {
      const subscription = getOrCreateSubscription(
        subscriptionsRef.current,
        newSubscriber,
        createSubscription
      );

      subscription.listeners.push(callback);

      return () => {
        const subscription = getSubscription(
          subscriptionsRef.current,
          newSubscriber
        );

        if (subscription?.listeners) {
          subscription.listeners = subscription?.listeners.filter(
            listener => listener !== callback
          );

          // maybe remove subscription entirely
          if (subscription.listeners.length === 0) {
            subscriptionsRef.current = subscriptionsRef.current.filter(
              s => s !== subscription
            );
          }
        }
      };
    },
    [createSubscription]
  );

  // updates to useMutableSource will only be triggered by Formik's dispatches
  useIsomorphicLayoutEffect(() => {
    unstable_batchedUpdates(() => {
      subscriptionsRef.current.forEach(subscription => {
        const prevState = subscription.prevStateRef.current;
        const newState = subscription.selector(stateRef.current);

        if (!subscription.subscriber.comparer(prevState, newState)) {
          subscription.prevStateRef.current = newState;
          subscription.listeners.forEach(listener => listener());
        }
      });
    });
  }, [committedState]);

  return {
    mutableSource,
    getSubscribeFn,
    createSelector,
    getSelector,
    createSubscriber,
  };
};
