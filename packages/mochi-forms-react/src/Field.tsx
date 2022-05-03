import * as React from 'react';
import { isFunction } from './utils';
import invariant from 'tiny-warning';
import { PathOf, ValueMatchingPath } from './helpers/path-helpers';
import { useFieldProps } from './FieldProps';
import { useFieldMeta } from './FieldMeta';
import { useFieldHelpers } from './FieldHelpers';
import { useFormApi } from './FormApi';
import { FormikValues } from './types';
import { FieldConfigPropsByName } from './types/field-config-types';
import { FieldAsCompatibleComponent } from './types/field-as-component-types';

// need to make sure this emits validate, etc
export type UseFieldProps<
  Values extends FormikValues,
  Name extends PathOf<Values>,
  AsComponent extends FieldAsCompatibleComponent
> = FieldConfigPropsByName<Values, Name, AsComponent> &
  Omit<
    React.ComponentProps<AsComponent>,
    keyof FieldConfigPropsByName<Values, Name, AsComponent>
  >;

export type FieldComponent<Values> = {
  <
    Name extends PathOf<Values>,
    AsField extends FieldAsCompatibleComponent = 'input'
  >(
    props: FieldConfigPropsByName<Values, Name, AsField>
  ): JSX.Element;

  displayName?: string;
  propTypes?: React.WeakValidationMap<any>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<any>;
  id?: string;
};

export function useField<
  Values,
  Name extends PathOf<Values>,
  FieldAs extends FieldAsCompatibleComponentMatchingValue<
    Values,
    ValueMatchingPath<Values, Name>
  >
>(props: UseFieldProps<Values, Name, FieldAs>) {
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
  FieldAs extends FieldAsCompatibleComponent
> = (
  props: FieldComponentByValueProps<Values, Value, FieldAs>
) => React.ReactElement | null;

export type FieldProps<
  Values,
  Value,
  FieldAs extends FieldAsCompatibleComponent
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
  FieldAs extends FieldAsCompatibleComponent = 'input'
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
  const [field] = useField<Values, Value, FieldAs>(useFieldProps);

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
