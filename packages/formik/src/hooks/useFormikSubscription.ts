import { useMemo } from 'react';
import { useSubscription } from 'use-subscription';
import { FormikState, FormikSubscribeFn } from '../types';

export const useFormikSubscription = <Values, Return = FormikState<Values>>(
  getCurrentValue: () => Return,
  subscribe: FormikSubscribeFn,
): Return => {

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const subscription = useMemo(
    () => ({
      getCurrentValue,
      subscribe,
    }),
    [getCurrentValue, subscribe]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useSubscription(subscription);
};
