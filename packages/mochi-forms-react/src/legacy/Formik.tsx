import invariant from 'tiny-warning';
import { isFunction } from 'lodash';
import React from 'react';
import { useFormController } from '../FormController';
import { selectFullState } from '../helpers/state-selectors';
import { FormikValues } from '../types';
import { isEmptyChildren } from '../utils';
import { FormikProvider } from './FormikContext';
import { FormikProps, FormikConfig } from './legacy-types';

export const useFormik = useFormController;

export function Formik<
  Values extends FormikValues = FormikValues,
  ExtraProps = {}
>(props: FormikConfig<Values> & ExtraProps) {
  const formik = useFormik<Values>(props);
  const { component, children, render, innerRef } = props;

  // Get initial Full State, but if we don't need it, we won't subscribe to updates
  const formikState = formik.useState(
    selectFullState,
    Object.is,
    !!component || !!render || isFunction(children) || !!innerRef
  );

  const formikbag: FormikProps<Values> = {
    ...formik,
    ...formikState,
  };

  // This allows folks to pass a ref to <Formik />
  React.useImperativeHandle(innerRef, () => formikbag);

  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      invariant(
        !props.render,
        `<Formik render> has been deprecated and will be removed in future versions of Formik. Please use a child callback function instead. To get rid of this warning, replace <Formik render={(props) => ...} /> with <Formik>{(props) => ...}</Formik>`
      );
      // eslint-disable-next-line
    }, []);
  }
  return (
    <FormikProvider value={formik}>
      {component
        ? React.createElement(component as any, formikbag)
        : render
        ? render(formikbag)
        : children // children come last, always called
        ? isFunction(children)
          ? (children as (bag: FormikProps<Values>) => React.ReactNode)(
              formikbag as FormikProps<Values>
            )
          : !isEmptyChildren(children)
          ? React.Children.only(children)
          : null
        : null}
    </FormikProvider>
  );
}
