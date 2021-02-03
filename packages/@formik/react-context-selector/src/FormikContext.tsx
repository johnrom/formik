import * as React from 'react';
import {
  createContext,
  useContext,
  useContextSelector,
} from 'use-context-selector';
import invariant from 'tiny-warning';
import { FormikContextWithState } from '@formik/core';

export const FormikContext = createContext<FormikContextWithState<any>>(
  undefined as any
);

export const FormikProvider = FormikContext.Provider;

export function useFormikContext<Values>() {
  return useContext<FormikContextWithState<Values>>(FormikContext);
}

export function FormikConsumer<Values = any>({
  children,
}: {
  children: (formik: FormikContextWithState<Values>) => React.ReactNode;
}) {
  const formik = useFormikContext<Values>();

  invariant(
    !!formik,
    `Formik context is undefined, please verify you are calling useFormikContext() as child of a <Formik> component.`
  );

  return <>{children(formik)}</>;
}

export function useFormikContextSelector<Values = any, Slice = any>(
  selector: (value: FormikContextWithState<Values>) => Slice
): Slice {
  return useContextSelector(FormikContext, selector);
}

export const useFullFormikState = <Values,>(
  context: FormikContextWithState<Values>
) => context;
