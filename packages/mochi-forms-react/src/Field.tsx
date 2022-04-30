import * as React from 'react';
import { isFunction } from './utils';
import invariant from 'tiny-warning';
import { PathMatchingValue } from './helpers/path-helpers';
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

export type FieldCompatibleComponent = React.ElementType<
  FieldAsProps<any, any, any, any>
>;

export type FieldAsComponent<Values, Value, FormattedValue, OnChangeValue> =
  React.ElementType<FieldAsProps<Values, Value, FormattedValue, OnChangeValue>>;

/**
 * These props configure how the field works.
 */
export type FieldConfigProps<Values, Value, FormattedValue, OnChangeValue> = {
  /**
   * Field name
   */
  name: PathMatchingValue<Value, Values>;

  /**
   * Validate a single field value independently
   */
  validate?: FieldValidator<SingleValue<Value>>;

  /**
   * Function to parse raw input value before setting it to state
   */
  parse?: ParseFn<SingleValue<Value>, OnChangeValue>;

  /**
   * Function to transform value passed to input
   */
  format?: FormatFn<SingleValue<Value>, FormattedValue>;

  /**
   * Wait until blur event before formatting input value?
   * @default false
   */
  formatOnBlur?: boolean;

  /** checkbox value to match against current value */
  value?: FormattedValue;
};

export interface FieldAsProps<Values, Value, FormattedValue, OnChangeValue> {
  /** Value of the field */
  value: FormattedValue;
  /** Name of the field */
  name: PathMatchingValue<Value, Values>;
  /** Change event handler */
  onChange: FieldOnChangeProp<OnChangeValue>;
  /** Blur event handler */
  onBlur: FieldOnBlurProp;
}

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

/** Field input value, name, and event handlers */
export type FieldAsComponentProps<
  Values,
  Value,
  FieldAs extends FieldCompatibleComponent
> = FieldAs extends FieldAsComponent<
  Values,
  Value,
  infer FormattedValue,
  infer OnChangeValue
>
  ? FieldAsProps<Values, Value, FormattedValue, OnChangeValue>
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
