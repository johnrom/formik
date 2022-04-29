import { useMemo } from 'react';
import { useFormState } from './FormState';
import { FormReducerState } from './types';
import { getIn, isShallowEqual } from './utils';

/** Field metadata */
export interface FieldMetaProps<Value> {
  /** Value of the field */
  value: Value;
  /** Error message of the field */
  error?: string;
  /** Has the field been visited? */
  touched: boolean;
  /** Initial value of the field */
  initialValue?: Value;
  /** Initial touched state of the field */
  initialTouched: boolean;
  /** Initial error message of the field */
  initialError?: string;
}

/**
 * Get FieldMetaProps from state.
 */
export const getFieldMetaSelectorByName =
  <Values,>(name: string) =>
  (
    state: Pick<
      FormReducerState<Values>,
      | 'values'
      | 'errors'
      | 'touched'
      | 'initialValues'
      | 'initialTouched'
      | 'initialErrors'
    >
  ) => ({
    value: getIn(state.values, name),
    error: getIn(state.errors, name),
    touched: !!getIn(state.touched, name),
    initialValue: getIn(state.initialValues, name),
    initialTouched: !!getIn(state.initialTouched, name),
    initialError: getIn(state.initialErrors, name),
  });

/**
 * Get field state from `FormikState`.
 */
export const useFieldMeta = <Value,>(name: string): FieldMetaProps<Value> => {
  const [fieldMeta] = useFormState<any, FieldMetaProps<Value>>(
    useMemo(() => getFieldMetaSelectorByName(name), [name]),
    isShallowEqual
  );

  return fieldMeta;
};
