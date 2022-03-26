import { createContext, useContext } from 'react';
import invariant from 'invariant';
import type { FormikContextType } from './types';

export const FormikContext = createContext<FormikContextType<any>>(
  undefined as any
);
export const FormikProvider = FormikContext.Provider;
export const FormikConsumer = FormikContext.Consumer;

export function useFormikContext<Values>() {
  const formik = useContext<FormikContextType<Values>>(FormikContext);

  invariant(
    !!formik,
    `Formik context is undefined, please verify you are calling useFormikContext() as child of a <Formik> component.`
  );

  return formik;
}
