import invariant from 'invariant';
import * as React from 'react';
import { FormApi, FormikValues } from './types';

/**
 * This Context provides the completely stable Formik API. Don't use this directly,
 * instead use the providers `<FormController />` or `<FormProvider />`
 * and the consumers `<FormApi />`, `useFormApi()`, or `withFormApi()`.
 *
 * @private
 */
export const FormApiContext = React.createContext<FormApi<any>>(
  undefined as any
);
FormApiContext.displayName = 'FormikContext';

export function useFormApi<Values extends FormikValues>(): FormApi<Values> {
  const formApi = React.useContext(FormApiContext);

  invariant(
    !!formApi,
    'FormApiContext is undefined, please verify you are calling useFormApi() as child of the component `<FormController />` or `<FormProvider />`.'
  );

  return formApi;
}
