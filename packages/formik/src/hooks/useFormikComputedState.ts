import { useMemo } from 'react';
import { FormikApi } from './useFormikApi';
import { FormikState } from '../types';
import isEqual from 'react-fast-compare';
import { useFormikState } from './useFormikState';

export const useFormikComputedStateInternal = (
  api: FormikApi<any>,
  state: Pick<FormikState<any>, 'errors' | 'dirty'>
): FormikComputedState => {
  const { isFormValid } = api;

  const isValid = useMemo(() => {
    return isFormValid(state.errors, state.dirty);
  }, [isFormValid, state.errors, state.dirty]);

  return {
    isValid,
    dirty: state.dirty,
  };
};

const selectComputedState = (state: FormikState<any>) => ({
  errors: state.errors,
  dirty: state.dirty,
});

/**
 * Subscribe to Formik State and Computed State updates.
 */
export const useFormikComputedState = () => {
  const [computedState, api] = useFormikState(selectComputedState, isEqual);

  return useFormikComputedStateInternal(api, computedState);
};
