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
  ParseFn,
  SingleValue,
} from './types';

export interface FieldConfigNameProp<Values, Name extends PathOf<Values>> {
  name: Name;
}

export interface FieldConfigAsProp<FieldAs extends FieldCompatibleComponent> {
  as?: FieldAs;
}

export interface FieldConfigValueProps<
  FormValue,
  FormattedValue,
  OnChangeValue
> {
  /**
   * Validate a single field value independently
   */
  validate?: FieldValidator<SingleValue<FormValue>>;

  /**
   * Function to parse raw input value before setting it to state
   */
  parse?: ParseFn<SingleValue<FormValue>, OnChangeValue>;

  /**
   * Function to transform value passed to input
   */
  format?: FormatFn<SingleValue<FormValue>, FormattedValue>;

  /** checkbox value to match against current value */
  value?: FormattedValue;
}

/**
 * These props configure how the field works.
 */
export interface FieldConfigProps<FormValue, FormattedValue, OnChangeValue>
  extends FieldConfigValueProps<FormValue, FormattedValue, OnChangeValue> {
  /**
   * Wait until blur event before formatting input value?
   * @default false
   */
  formatOnBlur?: boolean;

  /** checkbox value to match against current value */
  value?: FormattedValue;
}

export type FieldConfigPropsByName<
  Values,
  Name extends PathOf<Values>,
  AsField extends FieldCompatibleComponent
> = FieldConfigNameProp<Values, Name> &
  FieldConfigAsProp<AsField> &
  (Required<React.ComponentProps<AsField>> extends FieldAsValueProps<
    infer FormattedValue,
    infer OnChangeValue
  >
    ? FieldConfigProps<
        ValueMatchingPath<Values, Name>,
        FormattedValue,
        OnChangeValue
      >
    : {});

/**
 * Todo: Need to define a way to define AsFields which must match a given value.
 * This way `setFieldValue` within a predefined field could work.
 */
export interface FieldAsPropsByValue<Values, Value> {
  /**
   * Field name
   */
  name: PathMatchingValue<Value, Values>;
}

export interface FieldAsValueProps<FormattedValue, OnChangeValue> {
  /** Value of the field */
  value: FormattedValue;
  /** Change event handler */
  onChange: FieldOnChangeProp<OnChangeValue>;
}

export interface FieldAsProps<Values, Value, FormattedValue, OnChangeValue>
  extends FieldAsValueProps<FormattedValue, OnChangeValue> {
  /** Name of the field */
  name: PathMatchingValue<Value, Values>;
  /** Blur event handler */
  onBlur: FieldOnBlurProp;
}

export type FieldCompatibleComponent = React.ElementType<
  FieldAsProps<any, any, any, any>
>;

export type FieldAsComponent<Values, Value, FormattedValue, OnChangeValue> =
  React.ElementType<FieldAsProps<Values, Value, FormattedValue, OnChangeValue>>;

/** Field input value, name, and event handlers */
export type FieldAsComponentProps<
  Values,
  FieldAs extends FieldCompatibleComponent
> = React.ComponentProps<FieldAs> extends FieldAsProps<
  Values,
  infer Value,
  infer FormattedValue,
  infer OnChangeValue
>
  ? FieldAsProps<Values, Value, FormattedValue, OnChangeValue>
  : never;

export type UseFieldProps<
  Values,
  Value,
  FieldAs extends FieldCompatibleComponent
> = FieldAs extends FieldAsComponent<
  Values,
  Value,
  infer FormattedValue,
  infer OnChangeValue
>
  ? FieldConfigProps<Values, Value, FormattedValue, OnChangeValue> &
      Omit<
        React.ComponentPropsWithoutRef<FieldAs>,
        keyof FieldConfigProps<Values, Value, FormattedValue, OnChangeValue>
      > & {
        as?: FieldAs;
      }
  : never;

export function useField<
  Values,
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
