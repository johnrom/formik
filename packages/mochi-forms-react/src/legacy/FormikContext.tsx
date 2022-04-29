import * as React from 'react';
import { FormikConnectedType } from './legacy-types';
import invariant from 'tiny-warning';
import { FormProvider } from '../FormContext';
import { useFormApi } from '../FormApi';
import { useFormConfig } from '../FormConfig';
import { selectFullState } from '../helpers/state-selectors';

export const FormikProvider = FormProvider;
export const useFormikContext = useFormApi;
export const useFormikConfig = useFormConfig;

/**
 * @deprecated Please access state directly via the Formik API.
 */
export function FormikConsumer<Values = any>({
  children,
}: {
  children: (formik: FormikConnectedType<Values>) => React.ReactNode;
}) {
  const formik = useFormikContext<Values>();
  const config = useFormikConfig<Values>();
  const state = formik.useState(selectFullState);

  invariant(
    !!formik,
    `Formik context is undefined, please verify you are calling useFormikContext() as child of a <Formik> component.`
  );

  return (
    <>
      {children({
        ...formik,
        ...config,
        ...state,
      })}
    </>
  );
}
