import * as React from 'react';
import {
  FormikProps,
  GenericFieldHTMLAttributes,
  FieldMetaProps,
  FieldInputProps,
  FieldValidator,
} from './types';
import { useFormikContext } from './FormikContext';
import { isFunction, isEmptyChildren, isObject } from './utils';
import invariant from 'tiny-warning';
import { __asyncValues } from 'tslib';

export interface FieldProps<Values = any, ValueType = any, ExtraProps = {}> {
  field: FieldInputProps<ValueType, ExtraProps>;
  form: FormikProps<Values>; // if ppl want to restrict this for a given form, let them.
  meta: FieldMetaProps<ValueType>;
}

export type LegacyBag<Values, ValueType, ExtraProps = {}> = Omit<
  FieldProps<Values, ValueType, ExtraProps>,
  'meta'
>;

export interface FieldConfig<Values = any, ValueType = any, ExtraProps = {}> {
  /**
   * Field component to render. Can either be a string like 'select' or a component.
   * @deprecated
   */
  component?:
    | string
    | React.ComponentType<LegacyBag<Values, ValueType, ExtraProps>>;

  /**
   * Component to render. Can either be a string e.g. 'select', 'input', or 'textarea', or a component.
   */
  as?:
    | React.ComponentType<FieldProps<Values, ValueType, ExtraProps>['field']>
    | keyof JSX.IntrinsicElements;

  /**
   * Render prop (works like React router's <Route render={props =>} />)
   * @deprecated
   */
  render?: (props: LegacyBag<Values, ValueType, ExtraProps>) => React.ReactNode;

  /**
   * Children render function <Field name>{props => ...}</Field>)
   */
  children?: ((props: FieldProps<any>) => React.ReactNode) | React.ReactNode;

  /**
   * Validate a single field value independently
   */
  validate?: FieldValidator<ValueType>;

  /**
   * Field name
   */
  name: string;

  /** HTML input type */
  type?: string;

  /** Field value */
  value?: ValueType;

  /** Inner ref */
  innerRef?: (instance: any) => void;
}

export type FieldAttributes<
  ExtraProps = {},
  Values = any,
  ValueType = any
> = GenericFieldHTMLAttributes &
  FieldConfig<Values, ValueType, ExtraProps> &
  ExtraProps;

export function useField<Values = any, ExtraProps = {}, ValueType = any>(
  propsOrFieldName: string | FieldAttributes<ExtraProps, Values, ValueType>
) {
  const formik = useFormikContext<Values>();
  if (__DEV__) {
    invariant(
      formik,
      'useField() / <Field /> must be used underneath a <Formik> component or withFormik() higher order component'
    );
  }

  if (isObject(propsOrFieldName)) {
    if (process.env.NODE_ENV !== 'production') {
      invariant(
        (propsOrFieldName as FieldAttributes<ExtraProps, Values, ValueType>)
          .name,
        'Invalid field name. Either pass `useField` a string or an object containing a `name` key.'
      );
    }
    return formik.getFieldProps(propsOrFieldName);
  }

  return formik.getFieldProps({ name: propsOrFieldName });
}

export function Field<Values = any, ExtraProps = {}, ValueType = any>(
  fieldAttributes: FieldAttributes<ExtraProps, Values, ValueType>
) {
  const {
    validate,
    name,
    render,
    children,
    as: is, // `as` is reserved in typescript lol
    component,
    ...props
  } = fieldAttributes;
  const {
    validate: _validate,
    validationSchema: _validationSchema,
    ...formik
  } = useFormikContext<Values>();

  React.useEffect(() => {
    if (__DEV__) {
      invariant(
        !render,
        `<Field render> has been deprecated and will be removed in future versions of Formik. Please use a child callback function instead. To get rid of this warning, replace <Field name="${name}" render={({field, form}) => ...} /> with <Field name="${name}">{({field, form, meta}) => ...}</Field>`
      );

      invariant(
        !component,
        '<Field component> has been deprecated and will be removed in future versions of Formik. Use <Field as> instead. Note that with the `as` prop, all props are passed directly through and not grouped in `field` object key.'
      );

      invariant(
        !(is && children && isFunction(children)),
        'You should not use <Field as> and <Field children> as a function in the same <Field> component; <Field as> will be ignored.'
      );

      invariant(
        !(component && children && isFunction(children)),
        'You should not use <Field component> and <Field children> as a function in the same <Field> component; <Field component> will be ignored.'
      );

      invariant(
        !(render && children && !isEmptyChildren(children)),
        'You should not use <Field render> and <Field children> in the same <Field> component; <Field children> will be ignored'
      );
    }
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    formik.registerField(name, {
      validate: validate,
    });
    return () => {
      formik.unregisterField(name);
    };
  }, [formik, name, validate]);

  const [field, meta] = formik.getFieldProps<ExtraProps, Values, ValueType>(
    fieldAttributes
  );
  const legacyBag = { field, form: formik, ...props };

  if (render) {
    return render(legacyBag);
  }

  if (isFunction(children)) {
    return children({ ...legacyBag, meta });
  }

  if (component) {
    // This behavior is backwards compat with earlier Formik 0.9 to 1.x
    if (typeof component === 'string') {
      const { innerRef, ...rest } = props;
      return React.createElement(
        component,
        { ref: innerRef, ...field, ...rest },
        children
      );
    }
    // We don't pass `meta` for backwards compat
    return React.createElement(
      component,
      { field, form: formik, ...props },
      children
    );
  }

  // default to input here so we can check for both `as` and `children` above
  const asElement = is || 'input';

  if (typeof asElement === 'string') {
    const { innerRef, ...rest } = props;
    return React.createElement(
      asElement,
      { ref: innerRef, ...field, ...rest },
      children
    );
  }

  return React.createElement(asElement, { ...field, ...props }, children);
}
export const FastField = Field;
