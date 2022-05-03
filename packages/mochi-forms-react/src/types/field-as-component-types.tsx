import { FieldOnBlurProp, FieldOnChangeProp } from '../types';

/**
 * A limited API exposed to `<Field as={}>` which maps values back to `FormState`.
 *
 * `FieldAsComponent` is limited to 'dumb' components which do not know anything about `Form` state.
 *
 * They especially do not assume to know the type of the value in `FormState`.
 */
export interface FieldAsComponentRequiredProps<
  FormattedValue,
  ChangeHandlerValue
> extends FieldAsComponentValueProps<FormattedValue, ChangeHandlerValue> {
  /** Blur event handler */
  onBlur: FieldOnBlurProp;
}

/**
 * A component is compatible with `<Field as={}>` if it accepts the `FieldAsComponentProps` API.
 *
 * We'll infer the values it accepts to build `FieldConfigProps`.
 */
export type FieldAsComponentCompatibleProps = FieldAsComponentRequiredProps<
  any,
  any
>;

export type FieldAsCompatibleComponent =
  React.ElementType<FieldAsComponentCompatibleProps>;

export interface FieldAsComponentValueProps<
  FormattedValue,
  ChangeHandlerValue
> {
  /** Value of the field */
  value: FormattedValue;
  /** Change event handler */
  onChange: FieldOnChangeProp<ChangeHandlerValue>;
}

export type FieldAsComponentFormattedValue<
  FieldAs extends FieldAsCompatibleComponent
> = Required<React.ComponentProps<FieldAs>> extends FieldAsComponentValueProps<
  infer FormattedValue,
  infer _ChangeHandlerValue
>
  ? FormattedValue
  : never;

export type FieldAsComponentChangeHandlerValue<
  FieldAs extends FieldAsCompatibleComponent
> = Required<React.ComponentProps<FieldAs>> extends FieldAsComponentValueProps<
  infer _FormattedValue,
  infer ChangeHandlerValue
>
  ? ChangeHandlerValue
  : never;

export type FieldAsComponentExtraProps<
  FieldAs extends FieldAsCompatibleComponent
> = Omit<React.ComponentProps<FieldAs>, keyof FieldAsComponentCompatibleProps>;

export type FieldAsComponentProps<
  FormattedValue,
  ChangeHandlerValue,
  ExtraProps = {}
> = FieldAsComponentRequiredProps<FormattedValue, ChangeHandlerValue> &
  ExtraProps;

export type FieldAsComponentValuePropsByComponent<
  FieldAs extends FieldAsCompatibleComponent
> = FieldAsComponentRequiredProps<
  FieldAsComponentFormattedValue<FieldAs>,
  FieldAsComponentChangeHandlerValue<FieldAs>
> &
  FieldAsComponentExtraProps<FieldAs>;

/**
 * This is assignable to any type which requires a FieldAsComponent matching values.
 * This does not resolve to a specific component to infer values.
 */
export type AnyFieldAsComponentMatchingValues<
  FormattedValue,
  ChangeHandlerValue
> = React.ElementType<
  FieldAsComponentRequiredProps<FormattedValue, ChangeHandlerValue>
>;
