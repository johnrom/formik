import { FormikValues } from '@formik/core';
import { useFormikContext } from './FormikContext';

export function useFormikApi<Values extends FormikValues>() {
  return useFormikContext<Values>();
}
