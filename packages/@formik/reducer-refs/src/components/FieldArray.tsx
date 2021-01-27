import * as React from 'react';
import {
  SharedRenderProps,
  isEmptyChildren,
  FieldMetaProps,
} from '@formik/core';
import {
  ArrayHelpers,
  useFieldArray,
  UseFieldArrayProps,
} from '../hooks/useFieldArray';
import { FormikRefApi } from '../hooks/useFormikApi';

export type FieldArrayRenderProps<Values, Value> = ArrayHelpers & {
  form: FormikRefApi<Values>;
  field: FieldMetaProps<Value[]>;
  name: string;
};

export type FieldArrayProps<Values, Value> = UseFieldArrayProps &
  SharedRenderProps<FieldArrayRenderProps<Values, Value>>;

export const FieldArray = <Values, Value>(
  rawProps: FieldArrayProps<Values, Value>
) => {
  const {
    component,
    render,
    children,
    validateOnChange = true,
    ...rest
  } = rawProps;
  const props = {
    validateOnChange,
    ...rest,
  };

  const [field, arrayHelpers, formikApi] = useFieldArray<Values, Value>(props);
  const { validateOnChange: apiValidateOnChange, validateForm } = formikApi;

  /**
   * Should this go here?! Probably not. We should accept a validate fn and push it all the way to useField.
   */
  React.useEffect(() => {
    if (props.validateOnChange && apiValidateOnChange) {
      validateForm();
    }
  }, [props.validateOnChange, field.value, apiValidateOnChange, validateForm]);

  const renderProps: FieldArrayRenderProps<Values, Value> = React.useMemo(
    () => ({
      ...arrayHelpers,
      form: formikApi,
      field: field,
      name: props.name,
    }),
    [arrayHelpers, field, formikApi, props.name]
  );

  return component
    ? React.createElement(component, renderProps)
    : render
    ? render(renderProps)
    : children // children come last, always called
    ? typeof children === 'function'
      ? children(renderProps)
      : !isEmptyChildren(children)
      ? React.Children.only(children)
      : null
    : null;
};
