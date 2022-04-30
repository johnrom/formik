import invariant from 'tiny-warning';
import React from 'react';
import { FormSharedConfig, FormikValues } from './types';

/**
 * This Context provides Formik's configuration, which could change if a developer does not memoize.
 *
 * @private
 */
export const FormConfigContext = React.createContext<FormSharedConfig<any>>(
  undefined as any
);
FormConfigContext.displayName = 'FormConfigContext';

export const useFormConfig = <
  Values extends FormikValues
>(): FormSharedConfig<Values> => {
  const formConfig = React.useContext(FormConfigContext);

  invariant(
    !!formConfig,
    `FormikConfigContext is undefined, please verify you are calling useFormikConfigContext() as child of a <FormikProvider> component.`
  );

  return formConfig;
};
