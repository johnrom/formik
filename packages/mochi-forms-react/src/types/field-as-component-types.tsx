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

/**
 * I thought I could force certain props to be present here.
 * However, it doesn't seem to be an issue because we will enforce the correct props later.
 *
 * Keeping the type around in case I discover a way to force this.
 */
export type FieldAsCompatibleComponent = React.ElementType<any>;

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
  ExtraProps
> = FieldAsComponentRequiredProps<FormattedValue, ChangeHandlerValue> &
  ExtraProps;

export type FieldAsComponent<FormattedValue, ChangeHandlerValue, ExtraProps> =
  React.ComponentType<
    FieldAsComponentProps<FormattedValue, ChangeHandlerValue, ExtraProps>
  >;

export type FieldAsComponentPropsByComponent<
  FieldAs extends FieldAsCompatibleComponent
> = FieldAsComponentProps<
  FieldAsComponentFormattedValue<FieldAs>,
  FieldAsComponentChangeHandlerValue<FieldAs>,
  FieldAsComponentExtraProps<FieldAs>
>;

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
