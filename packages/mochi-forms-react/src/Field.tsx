import * as React from 'react';
import { isFunction } from './utils';
import invariant from 'tiny-warning';
import { PathOf, ValueMatchingPath } from './helpers/path-helpers';
import { useFieldProps } from './FieldProps';
import { FieldMetaProps, useFieldMeta } from './FieldMeta';
import { FieldHelperProps, useFieldHelpers } from './FieldHelpers';
import { useFormApi } from './FormApi';
import { FormikValues } from './types';
import {
  FieldConfigPropsByName,
  FieldConfigPropsByValue,
} from './types/field-config-types';
import {
  AnyFieldAsCompatibleComponent,
  FieldAsComponentPassThroughPropsByComponent,
  FieldAsComponentPropsByComponent,
} from './types/field-as-component-types';

export type UseFieldConfigByValue<
  Values extends FormikValues,
  Value,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldAsComponentPassThroughPropsByComponent<FieldAs> &
  FieldConfigPropsByValue<Values, Value, FieldAs>;

export type UseFieldPropsByName<
  Values extends FormikValues,
  Name extends PathOf<Values>,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldConfigPropsByName<Values, Name, FieldAs>;

export type UseFieldReturnValue<
  Value,
  FieldAs extends AnyFieldAsCompatibleComponent
> = [
  FieldAsComponentPropsByComponent<FieldAs>,
  FieldMetaProps<Value>,
  FieldHelperProps<Value>
];

export function useField<
  Values,
  Value,
  FieldAs extends AnyFieldAsCompatibleComponent
>(
  props: UseFieldConfigByValue<Values, Value, FieldAs>
): UseFieldReturnValue<Value, FieldAs> {
  const formApi = useFormApi<Values>();
  const { registerField, unregisterField } = formApi;
  const { name, validate } = props;

  const fieldMeta = useFieldMeta<Value>(name);

  React.useEffect(() => {
    if (name) {
      registerField(name, {
        validate,
      });
    }
    return () => {
      if (name) {
        unregisterField(name);
      }
    };
  }, [registerField, unregisterField, name, validate]);

  if (__DEV__) {
    invariant(
      formApi,
      'useField() / <Field /> must be used underneath a <Formik> component or withFormik() higher order component'
    );
  }

  invariant(
    name,
    'Invalid field name. Either pass `useField` a string or an object containing a `name` key.'
  );

  return [useFieldProps(props, fieldMeta), fieldMeta, useFieldHelpers(name)];
}

type FieldChildRenderFn<FieldAs extends AnyFieldAsCompatibleComponent> = (
  props: FieldAsComponentPropsByComponent<FieldAs>
) => React.ReactElement | null;

export interface FieldOnlyProps<FieldAs extends AnyFieldAsCompatibleComponent> {
  /** Inner ref */
  innerRef?: React.MutableRefObject<FieldAs>;
  children?: FieldChildRenderFn<FieldAs> | React.ReactNode;
}
export type FieldPropsByValue<
  Values,
  Value,
  FieldAs extends AnyFieldAsCompatibleComponent
> = UseFieldConfigByValue<Values, Value, FieldAs> & FieldOnlyProps<FieldAs>;

export const Field = <
  Values,
  Value,
  FieldAs extends AnyFieldAsCompatibleComponent = 'input'
>({
  props,
}: FieldPropsByValue<Values, Value, FieldAs>) => {
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      invariant(
        !(props.as && props.children && isFunction(props.children)),
        'You should not use <Field as> and <Field children> as a function in the same <Field> component; <Field as> will be ignored.'
      );
    }, []);
  }

  const { innerRef, children, ...useFieldConfig } = props;

  /**
   * todo: It works if I pass props itself for some reason,
   * even though innerRef and children are not assignable to props.
   *
   * However, it doesn't work if I omit those props.
   */
  const [field] = useField<Values, Value, FieldAs>(
    useFieldConfig as UseFieldConfigByValue<Values, Value, FieldAs>
  );

  if (isFunction(props.children)) {
    return props.children(field);
  }

  return React.createElement(
    props.as ?? 'input',
    { ref: props.innerRef, ...useFieldProps, ...field },
    props.children
  );
};

export interface UseFieldFn<Values> {
  <
    Name extends PathOf<Values>,
    FieldAs extends AnyFieldAsCompatibleComponent = 'input'
  >(
    props: UseFieldPropsByName<Values, Name, FieldAs>
  ): UseFieldReturnValue<ValueMatchingPath<Values, Name>, FieldAs>;
}

export interface FieldComponent<Values> {
  <
    Name extends PathOf<Values>,
    AsField extends AnyFieldAsCompatibleComponent = 'input'
  >(
    props: FieldConfigPropsByName<Values, Name, AsField>
  ): JSX.Element;

  displayName?: string;
  propTypes?: React.WeakValidationMap<any>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<any>;
  id?: string;
}
