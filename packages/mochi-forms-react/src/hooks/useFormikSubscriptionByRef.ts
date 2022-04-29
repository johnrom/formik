import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Selector,
  Comparer,
  useOptimizedSelector,
} from 'use-optimized-selector';
import { FormApi, FormState } from '../types';
import { useFormikSubscription } from './useFormikSubscription';

const nullSubscribeFn = () => () => {};

/**
 * Use Formik State from within Render.
 *
 * @param selector a memoized or constant function like `state => state.isSubmitting`
 * @param comparer an optional comparer, for checking whether previous and next selector results are equal
 * @param shouldSubscribe a bail-out for when the value doesn't need to be updated after the initial render. enables optional subscriptions for `render` props.
 */
export const useFormikSubscriptionByRef = <Values, Return = FormState<Values>>(
  formik: MutableRefObject<FormApi<Values> | null>,
  initialState: Return,
  selector: Selector<FormState<Values>, Return>,
  comparer?: Comparer<Return>
): Return => {
  const [formikApi, setFormikApi] = useState(formik.current);
  const { subscribe, getState } = formikApi ?? {};

  useEffect(() => {
    setFormikApi(formik.current);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  selector = useOptimizedSelector(selector, comparer);

  const getCurrentValue = useCallback(
    () => (getState ? selector(getState()) : initialState),
    [getState, selector, initialState]
  );
  const subscribeFn = useMemo(
    () => (subscribe ? subscribe : nullSubscribeFn),
    [subscribe]
  );

  return useFormikSubscription(getCurrentValue, subscribeFn);
};
