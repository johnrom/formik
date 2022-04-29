import { useMemo } from 'react';
import { useFormApi } from './FormApi';

/** Imperative handles to change a field's value, error and touched */
export interface FieldHelperProps<Value> {
  /** Set the field's value */
  setValue: (value: Value, shouldValidate?: boolean) => void;
  /** Set the field's touched value */
  setTouched: (value: boolean, shouldValidate?: boolean) => void;
  /** Set the field's error value */
  setError: (value: string | undefined) => void;
}

/**
 * Get memoized helpers from `FormikContext`.
 */
export const useFieldHelpers = (name: string): FieldHelperProps<any> => {
  const { setFieldValue, setFieldTouched, setFieldError } = useFormApi();
  return useMemo(
    () => ({
      setValue: (value: any, shouldValidate?: boolean) =>
        setFieldValue(name, value, shouldValidate),
      setTouched: (value: boolean, shouldValidate?: boolean) =>
        setFieldTouched(name, value, shouldValidate),
      setError: (value: any) => setFieldError(name, value),
    }),
    [name, setFieldValue, setFieldTouched, setFieldError]
  );
};
