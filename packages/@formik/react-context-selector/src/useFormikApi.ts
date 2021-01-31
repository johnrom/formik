import invariant from 'tiny-warning';
import React from 'react';
import { FormikContextType, FormikValues } from '@formik/core';
import { FormikContext } from './FormikContext';

export function useFormikApi<Values extends FormikValues>() {
  const formikApi = React.useContext(FormikContext);

  invariant(
    !!formikApi,
    `Formik context is undefined, please verify you are calling useFormikContext() as child of a <Formik> component.`
  );

  return (formikApi as unknown) as FormikContextType<Values>;
}
