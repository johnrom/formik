import { FormikValues } from '@formik/core';
import React, { MutableRefObject } from 'react';
import { Subscriber } from '../helpers/subscription-helpers';
import { FormikRefState } from '../types';
import { FormikRefApi } from './useFormikApi';
import {
  // eslint-disable-next-line
  // @ts-ignore
  unstable_useMutableSource as useMutableSource,
} from 'react';

export type FormSliceFn<Values, Result> = (
  formState: FormikRefState<Values>
) => Result;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const dontSubscribe = () => () => {};

/**
 * Important! Use a stable or memoized subscriber.
 */
export const useFormikStateSubscriptionInternal = <
  Values extends FormikValues,
  Args extends any[],
  Return
>(
  api: FormikRefApi<Values>,
  subscriber: Subscriber<FormikRefState<Values>, Args, Return>,
  shouldSubscribe = true
): Return => {
  const { mutableSource, getSubscribeFn, getSelector } = api;
  const getSnapshot = React.useMemo(
    () => (stateRef: MutableRefObject<FormikRefState<Values>>) =>
      getSelector(subscriber.selector)(stateRef.current),
    [getSelector, subscriber.selector]
  );
  const subscribe = React.useMemo(
    () => (shouldSubscribe ? getSubscribeFn(subscriber) : dontSubscribe),
    [getSubscribeFn, shouldSubscribe, subscriber]
  );
  const sliceState = useMutableSource(mutableSource, getSnapshot, subscribe);

  return sliceState;
};
