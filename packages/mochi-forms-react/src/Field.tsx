import * as React from 'react';
import { isFunction } from './utils';
import invariant from 'tiny-warning';
import {
  PathMatchingValue,
  PathOf,
  ValueMatchingPath,
} from './helpers/path-helpers';
import { useFieldProps } from './FieldProps';
import { FieldMetaProps, useFieldMeta } from './FieldMeta';
import { FieldHelperProps, useFieldHelpers } from './FieldHelpers';
import { useFormApi } from './FormApi';
import {
  FieldOnBlurProp,
  FieldOnChangeProp,
  FieldValidator,
  FormatFn,
  FormikValues,
  ParseFn,
  SingleValue,
} from './types';
import { NoInfer } from './helpers/type-helpers';

export interface FieldConfigNameProp<
  Values extends FormikValues,
  Name extends PathOf<Values>
> {
  name: Name;
}

export interface FieldCompatibleAsProps<Values extends FormikValues, Value> {
  name: PathMatchingValue<Value, Values>;
}

export type FieldCompatibleProps = FieldAsProps<any, any, any, any>;

export type FieldCompatibleComponent = React.ElementType<FieldCompatibleProps>;

export type FieldCompatibleComponentMatchingValue<
  Values extends FormikValues,
  Value
> = React.ElementType<
  Omit<FieldCompatibleProps, 'name'> & FieldCompatibleAsProps<Values, Value>
>;

export interface FieldConfigAsProp<FieldAs extends FieldCompatibleComponent> {
  as?: FieldAs;
}

export type FieldConfigAsPropMatchingValue<
  Values extends FormikValues,
  Value,
  FieldAs extends FieldCompatibleComponent
> = FieldAs extends FieldCompatibleComponentMatchingValue<Values, Value>
  ? {
      as?: FieldAs;
    }
  : {
      as?: never;
    };

export interface FieldConfigValueProps<
  FormValue,
  FormattedValue,
  ChangeHandlerValue
> {
  /**
   * Validate a single field value independently
   */
  validate?: FieldValidator<SingleValue<FormValue>>;

  /**
   * Function to parse raw input value before setting it to state
   */
  parse?: ParseFn<SingleValue<FormValue>, ChangeHandlerValue>;

  /**
   * Function to transform value passed to input
   */
  format?: FormatFn<SingleValue<FormValue>, FormattedValue>;
}

export interface FieldPassThroughFormattedValueProp<FormattedValue> {
  /** checkbox value to match against current value */
  value?: FormattedValue;
}

/**
 * These props configure how the field works.
 */
export interface FieldConfigProps<FormValue, FormattedValue, ChangeHandlerValue>
  extends FieldConfigValueProps<FormValue, FormattedValue, ChangeHandlerValue>,
    FieldPassThroughFormattedValueProp<FormattedValue> {
  /**
   * Wait until blur event before formatting input value?
   * @default false
   */
  formatOnBlur?: boolean;
}

export type FieldConfigValuePropsMatchingValue<
  Value,
  FieldAs extends FieldCompatibleComponent
> = Required<React.ComponentProps<FieldAs>> extends FieldAsValueProps<
  infer FormattedValue,
  infer ChangeHandlerValue
>
  ? FieldConfigProps<Value, FormattedValue, ChangeHandlerValue>
  : {};

export type FieldConfigPropsMatchingValue<
  Values extends FormikValues,
  Value,
  FieldAs extends FieldCompatibleComponent
> = FieldConfigAsPropMatchingValue<Values, Value, FieldAs> &
  FieldConfigValuePropsMatchingValue<Value, FieldAs>;

export type FieldConfigPropsMatchingName<
  Values extends FormikValues,
  Name extends PathOf<Values>,
  FieldAs extends FieldCompatibleComponent
> = FieldConfigPropsMatchingValue<
  Values,
  ValueMatchingPath<Values, Name>,
  FieldAs
>;

export type FieldConfigPropsByName<
  Values extends FormikValues,
  Name extends PathOf<Values>,
  FieldAs extends FieldCompatibleComponent
> = FieldConfigNameProp<Values, Name> &
  FieldConfigAsProp<FieldAs> &
  FieldConfigPropsMatchingName<
    NoInfer<Values>,
    NoInfer<Name>,
    NoInfer<FieldAs>
  >;

/**
 * Todo: Need to define a way to define FieldAss which must match a given value.
 * This way `setFieldValue` within a predefined field could work.
 */
export interface FieldAsNamePropMatchingValue<
  Values extends FormikValues,
  Value
> {
  /**
   * Field name
   */
  name: PathMatchingValue<Value, Values>;
}

export interface FieldAsValueProps<FormattedValue, ChangeHandlerValue> {
  /** Value of the field */
  value: FormattedValue;
  /** Change event handler */
  onChange: FieldOnChangeProp<ChangeHandlerValue>;
}

export interface FieldAsProps<
  Values extends FormikValues,
  Value,
  FormattedValue,
  ChangeHandlerValue
> extends FieldAsValueProps<FormattedValue, ChangeHandlerValue> {
  /** Name of the field */
  name: PathMatchingValue<Value, Values>;
  /** Blur event handler */
  onBlur: FieldOnBlurProp;
}

export type FieldAsComponent<
  Values extends FormikValues,
  Value,
  FormattedValue,
  ChangeHandlerValue
> = React.ElementType<
  FieldAsProps<Values, Value, FormattedValue, ChangeHandlerValue>
>;

export function useField<
  Values extends FormikValues,
  Value,
  FieldAs extends FieldCompatibleComponent = 'input'
>(
  props: UseFieldProps<Values, Value, FieldAs>
): [
  FieldAsComponentProps<Values, Value, FieldAs>,
  FieldMetaProps<Value>,
  FieldHelperProps<Value>
] {
  const formApi = useFormApi<Values>();
  const { registerField, unregisterField } = formApi;
  const { name: fieldName, validate: validateFn } = props;

  const fieldMeta = useFieldMeta<Value>(fieldName);

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
      formApi,
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

type FieldChildRenderFn<
  Values,
  Value,
  FieldAs extends FieldCompatibleComponent
> = (
  props: FieldAsComponentProps<Values, Value, FieldAs>
) => React.ReactElement | null;

export type FieldProps<
  Values,
  Value,
  FieldAs extends FieldCompatibleComponent
> = UseFieldProps<Values, Value, FieldAs> & {
  /** Inner ref */
  innerRef?: (instance: any) => void;
  children:
    | FieldChildRenderFn<Values, Value, FieldAs>
    | React.ReactNode
    | undefined;
};

export const Field = <
  Values,
  Value = any,
  FieldAs extends FieldCompatibleComponent = 'input'
>({
  children,
  innerRef,
  ...useFieldProps
}: FieldProps<Values, Value, FieldAs>) => {
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      invariant(
        !(useFieldProps.as && children && isFunction(children)),
        'You should not use <Field as> and <Field children> as a function in the same <Field> component; <Field as> will be ignored.'
      );
    }, []);
  }

  // todo: not sure why this isn't matching
  const [field] = useField<Values, Value, FieldAs>(useFieldProps as any);

  if (isFunction(children)) {
    return children(field);
  }

  return React.createElement(
    useFieldProps.as ?? 'input',
    { ref: innerRef, ...useFieldProps, ...field },
    children
  );
};

Field.displayName = 'Field';
