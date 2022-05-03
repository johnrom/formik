import { PathOf, ValueMatchingPath } from '../helpers/path-helpers';
import {
  FieldValidator,
  FormatFn,
  FormikValues,
  ParseFn,
  SingleValue,
} from '../types';
import {
  FieldAsCompatibleComponent,
  FieldAsComponentValueProps,
} from './field-as-component-types';

export interface FieldConfigNameProp<
  Values extends FormikValues,
  Name extends PathOf<Values>
> {
  name: Name;
}

export interface FieldConfigAsProp<FieldAs extends FieldAsCompatibleComponent> {
  as?: FieldAs;
}

export interface FieldConfigValidateProp<FormValue> {
  validate?: FieldValidator<SingleValue<FormValue>>;
}

/**
 * If ChangeHandlerValue cannot be assigned to FormValue,
 * parse is required.
 */
export type FieldConfigParseProp<FormValue, ChangeHandlerValue> =
  FormValue extends ChangeHandlerValue
    ? {
        parse?: ParseFn<SingleValue<FormValue>, ChangeHandlerValue>;
      }
    : {
        parse: ParseFn<SingleValue<FormValue>, ChangeHandlerValue>;
      };

/**
 * If ChangeHandlerValue cannot be assigned to FormValue,
 * parse is required.
 */
export type FieldConfigFormatProp<FormValue, FormattedValue> =
  FormattedValue extends FormValue
    ? {
        format?: FormatFn<SingleValue<FormValue>, FormattedValue>;
      }
    : {
        format: FormatFn<SingleValue<FormValue>, FormattedValue>;
      };

export type FieldConfigValueProps<
  FormValue,
  FormattedValue,
  ChangeHandlerValue
> = FieldConfigValidateProp<FormValue> &
  FieldConfigParseProp<FormValue, ChangeHandlerValue> &
  FieldConfigFormatProp<FormValue, FormattedValue>;

export interface FieldPassThroughFormattedValueProp<FormattedValue> {
  /** checkbox value to match against current value */
  value?: FormattedValue;
}

/**
 * These props configure how the field works.
 */
export type FieldConfigProps<FormValue, FormattedValue, ChangeHandlerValue> =
  FieldConfigValueProps<FormValue, FormattedValue, ChangeHandlerValue> &
    FieldPassThroughFormattedValueProp<FormattedValue> & {
      /**
       * Wait until blur event before formatting input value?
       * @default false
       */
      formatOnBlur?: boolean;
    };

export type FieldConfigPropsMatchingValue<
  Value,
  FieldAs extends FieldAsCompatibleComponent
> = Required<React.ComponentProps<FieldAs>> extends FieldAsComponentValueProps<
  infer FormattedValue,
  infer ChangeHandlerValue
>
  ? FieldConfigProps<Value, FormattedValue, ChangeHandlerValue>
  : {};

export type FieldConfigPropsMatchingName<
  Values extends FormikValues,
  Name extends PathOf<Values>,
  FieldAs extends FieldAsCompatibleComponent
> = FieldConfigPropsMatchingValue<ValueMatchingPath<Values, Name>, FieldAs>;

export type FieldConfigPropsByName<
  Values extends FormikValues,
  Name extends PathOf<Values>,
  FieldAs extends FieldAsCompatibleComponent
> = FieldConfigNameProp<Values, Name> &
  FieldConfigAsProp<FieldAs> &
  FieldConfigPropsMatchingName<Values, Name, FieldAs>;
