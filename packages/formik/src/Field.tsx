import * as React from 'react';
import {
  FormikProps,
  GenericFieldHTMLAttributes,
  FieldMetaProps,
  FieldHelperProps,
  FieldInputProps,
  FieldValidator,
  FieldValue,
  FieldName,
} from './types';
import { isFunction, isEmptyChildren, isObject } from './utils';
import invariant from 'tiny-warning';
import { useFieldHelpers, useFieldMeta, useFieldProps } from './hooks/hooks';
import { useFormikConfig, useFormikContext } from './FormikContext';
import { selectFullState } from './helpers/form-helpers';

export type FieldProps<Values = any, Path extends string = any> = {
  field: FieldInputProps<Values, Path>;
  // if ppl want to restrict this for a given form, let them.
  form: FormikProps<Values>;
  meta: FieldMetaProps<FieldValue<Values, Path>>;
}

/**
 * If ExtraProps is any, allow any props
 */
export type ExtraPropsOrAnyProps<ExtraProps> = (object extends ExtraProps ? Record<string, any> : ExtraProps);

type FieldAsPropsWithoutExtraProps<Values, Path extends string, ExtraProps> =
  FieldHookConfig<Values, Path, ExtraProps> &
  FieldInputProps<Values, Path>;

type FieldAsExtraProps = Omit<
  Record<string, any>,
  'as' | 'component' | 'render' | 'children' |
    keyof FieldAsPropsWithoutExtraProps<any, any, any>
>;

export type FieldAsProps<
  Values = any,
  Path extends string = any,
  ExtraProps extends FieldAsExtraProps = any
> = FieldAsPropsWithoutExtraProps<Values, Path, ExtraProps> &
    ExtraPropsOrAnyProps<ExtraProps>;

/**
 * field.as = Component
 *
 * @private
 */
export type FieldAsComponentConfig<
  Values,
  Path extends string,
  ExtraProps extends FieldAsExtraProps
> =
  React.PropsWithChildren<
    {
      as: React.ComponentType<
        FieldAsProps<Values, Path, ExtraProps>
      >,
      component?: undefined,
      render?: undefined,
    }
  > &
    FieldHookConfig<Values, Path, ExtraProps> &
    ExtraPropsOrAnyProps<ExtraProps>;

export type ParseFn<Value> = (value: unknown, name: string) => Value;
export type FormatFn<Value> = (value: Value, name: string) => any;

export type FieldHookConfig<Values, Path extends string, ExtraProps = any> = {
  /**
   * Component to render. Can either be a string e.g. 'select', 'input', or 'textarea', or a component.
   */
  as?:
    | string
    | React.ComponentType<
        FieldAsProps<Values, Path, ExtraProps>
      >;

  /**
   * Validate a single field value independently
   */
  validate?: FieldValidator<FieldValue<Values, Path>>;

  /**
   * Function to parse raw input value before setting it to state
   */
  parse?: ParseFn<FieldValue<Values, Path>>;

  /**
   * Function to transform value passed to input
   */
  format?: FormatFn<FieldValue<Values, Path>>;

  /**
   * Wait until blur event before formatting input value?
   * @default false
   */
  formatOnBlur?: boolean;

  /**
   * HTML multiple attribute
   */
  multiple?: boolean;

  /**
   * Field name
   */
  name: FieldName<Values, Path>;

  /** HTML input type */
  type?: string;

  /** Field value */
  value?: FieldValue<Values, Path>;

  /** Inner ref */
  innerRef?: (instance: any) => void;
}

export function useField<Values = any, Path extends string = any, ExtraProps = any>(
  propsOrFieldName: FieldName<Values, Path> | FieldHookConfig<Values, Path, ExtraProps>
): [FieldInputProps<Values, Path>, FieldMetaProps<FieldValue<Values, Path>>, FieldHelperProps<FieldValue<Values, Path>>] {
  const formik = useFormikContext<Values>();
  const {
    registerField,
    unregisterField,
  } = formik;

  const props = isObject(propsOrFieldName)
    ? propsOrFieldName
    : { name: propsOrFieldName };

  const { name: fieldName, validate: validateFn } = props;

  const fieldMeta = useFieldMeta<FieldValue<Values, Path>>(fieldName);

  React.useEffect(() => {
    if (fieldName) {
      registerField(fieldName, {
        validate: validateFn,
      });
    }
    return () => {
      if (fieldName) {
        unregisterField(fieldName);
      }
    };
  }, [registerField, unregisterField, fieldName, validateFn]);

  if (__DEV__) {
    invariant(
      formik,
      'useField() / <Field /> must be used underneath a <Formik> component or withFormik() higher order component'
    );
  }

  invariant(
    fieldName,
    'Invalid field name. Either pass `useField` a string or an object containing a `name` key.'
  );

  return [
    useFieldProps(props, fieldMeta),
    fieldMeta,
    useFieldHelpers(fieldName),
  ];
}

/**
 * field.as = string
 *
 * @private
 */
export type FieldAsStringConfig<Values, Path extends string, ExtraProps> =
  React.PropsWithChildren<
    {
      as: string,
      component?: undefined,
      render?: undefined,
    }
  > &
    FieldHookConfig<Values, Path, ExtraProps> &
    GenericFieldHTMLAttributes;

/**
 * field.component = string
 *
 * @private
 */
export type FieldStringComponentConfig<Values, Path extends string> =
  React.PropsWithChildren<
    {
      as?: undefined,
      component: string,
      render?: undefined,
    }
  > &
    FieldHookConfig<Values, Path, {}> &
    GenericFieldHTMLAttributes;

type LegacyBag<Values, Path extends string> = {
  field: FieldInputProps<Values, Path>;
  // if ppl want to restrict this for a given form, let them.
  form: FormikProps<Values>;
}

type FieldComponentPropsWithoutExtraProps<Values, Path extends string, ExtraProps> =
  FieldHookConfig<Values, Path, ExtraProps> &
  LegacyBag<Values, Path>;

type FieldComponentExtraProps = Omit<
  Record<string, any>,
  'as' | 'component' | 'render' | 'children' |
    keyof FieldComponentPropsWithoutExtraProps<any, any, any>
>;

export type FieldComponentProps<
  Values = any,
  Path extends string = any,
  ExtraProps extends FieldComponentExtraProps = any
> = FieldComponentPropsWithoutExtraProps<Values, Path, ExtraProps> &
  ExtraPropsOrAnyProps<ExtraProps>;

/**
 * field.component = Component
 *
 * @private
 */
export type FieldComponentConfig<
  Values,
  Path extends string,
  ExtraProps extends FieldComponentExtraProps
> =
  React.PropsWithChildren<
    {
      as?: undefined,
      component: React.ComponentType<
        FieldComponentProps<Values, Path, ExtraProps>
      >,
      render?: undefined,
    }
  > &
      FieldHookConfig<Values, Path, ExtraProps> &
      ExtraPropsOrAnyProps<ExtraProps>;

export type FieldRenderFunction<Values, Path extends string> = (
  props: FieldProps<Values, Path>
) => React.ReactElement | null;

/**
 * field.render = Function
 *
 * @private
 */
type FieldRenderConfig<Values, Path extends string> = {
  as?: undefined,
  component?: undefined,
  render: FieldRenderFunction<Values, Path>;
  children?: undefined
} & FieldHookConfig<Values, Path>;

/**
 * field.children = Function
 *
 * @private
 */
type FieldChildrenConfig<Values, Path extends string> = {
  as?: undefined,
  component?: undefined,
  render?: undefined,
  children: FieldRenderFunction<Values, Path>;
} & FieldHookConfig<Values, Path>;

/**
 * no config, <Field name="">
 *
 * @private
 */
type FieldDefaultConfig<Values, Path extends string> =
  React.PropsWithChildren<
    {
      as?: undefined,
      component?: undefined,
      render?: undefined,
    }
  > &
    FieldHookConfig<Values, Path> &
    GenericFieldHTMLAttributes;

export type FieldConfig<Values, Path extends string, ExtraProps = any> =
  FieldAsStringConfig<Values, Path, ExtraProps> |
  FieldAsComponentConfig<Values, Path, ExtraProps> |
  FieldStringComponentConfig<Values, Path> |
  FieldComponentConfig<Values, Path, ExtraProps> |
  FieldRenderConfig<Values, Path> |
  FieldChildrenConfig<Values, Path> |
  FieldDefaultConfig<Values, Path>;

/**
 * @deprecated use `FieldConfig`
 */
export type FieldAttributes<Values, Path extends string, ExtraProps = any> =
  FieldConfig<Values, Path, ExtraProps>;

export function Field<
  Values = any,
  Path extends string = any,
  ExtraProps = any
>(
  props: FieldConfig<Values, Path, ExtraProps>
) {
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      invariant(
        !props.render,
        `<Field render> has been deprecated and will be removed in future versions of Formik. Please use a child callback function instead. To get rid of this warning, replace <Field name="${props.name}" render={({field, form}) => ...} /> with <Field name="${props.name}">{({field, form, meta}) => ...}</Field>`
      );

      invariant(
        !(props.as && props.children && isFunction(props.children)),
        'You should not use <Field as> and <Field children> as a function in the same <Field> component; <Field as> will be ignored.'
      );

      invariant(
        !(props.component && props.children && isFunction(props.children)),
        'You should not use <Field component> and <Field children> as a function in the same <Field> component; <Field component> will be ignored.'
      );

      invariant(
        !(
          props.render &&
          props.children &&
          // impossible type
          !isEmptyChildren((props as any).children)
        ),
        'You should not use <Field render> and <Field children> in the same <Field> component; <Field children> will be ignored'
      );
      // eslint-disable-next-line
    }, []);
  }

  const [field, meta] = useField(props);

  /**
   * If we use render function or use functional children, we continue to
   * subscribe to the full FormikState because these do not have access to hooks.
   * We also do this for Component for backwards compatibility.
   *
   * Otherwise, we will pointlessly get the initial values but never subscribe to updates.
   */
  const formikApi = useFormikContext<Values>();
  const formikConfig = useFormikConfig();
  const formikState = formikApi.useState(
    selectFullState,
    Object.is,
    !!props.render || isFunction(props.children) || (!!props.component && typeof props.component !== 'string')
  );

  const form = {
      ...formikApi,
      ...formikConfig,
      ...formikState,
  };

  if (props.render) {
    return props.render({ field, form, meta });
  }

  if (isFunction(props.children)) {
    return props.children({ field, form, meta });
  }

  if (props.as && typeof props.as !== 'string') {
    const {
      render,
      component,
      as,
      children,
      ...fieldAsProps
    } = props as FieldAsComponentConfig<Values, Path, ExtraProps>;
    return React.createElement(
      props.as,
      { ...fieldAsProps, ...field } as any,
      children
    );
  }

  if (props.component && typeof props.component !== 'string') {
    const {
      // render props
      render,
      children,
      as,
      component,
      ...componentProps
    } = props as FieldComponentConfig<Values, Path, ExtraProps>;

    // We don't pass `meta` for backwards compat
    return React.createElement(
      component,
      { field, form, ...componentProps } as any,
      children
    );
  }

  const {
    innerRef,
    validate,
    parse,
    format,
    formatOnBlur,
    name,
    value,
    as,
    component,
    render,
    children,
    ...htmlProps
  } = props;

  return React.createElement(
    props.as || props.component || "input",
    // field has FieldValue<> while HTML expects
    { ref: props.innerRef, ...field, ...htmlProps } as any,
    children
  );
}
