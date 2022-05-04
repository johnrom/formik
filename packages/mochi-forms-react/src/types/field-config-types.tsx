import React from 'react';
import {
  PathMatchingValue,
  PathOf,
  ValueMatchingPath,
} from '../helpers/path-helpers';
import { NoInfer } from '../helpers/type-helpers';
import {
  FieldValidator,
  FormatFn,
  FormikValues,
  ParseFn,
  SingleValue,
} from '../types';
import {
  FieldAsCompatibleComponent,
  FieldAsComponentRequiredProps,
  FieldAsComponentValueProps,
} from './field-as-component-types';

export interface FieldConfigNameProp<
  Values extends FormikValues,
  Name extends PathOf<Values>
> {
  name: Name;
}

export interface AnyFieldConfigNameProp<Values extends FormikValues> {
  name: PathOf<Values>;
}

export interface FieldConfigAsProp<FieldAs extends FieldAsCompatibleComponent> {
  as?: FieldAs;
}

export interface AnyFieldConfigAsProp {
  as: FieldAsCompatibleComponent;
}

export interface FieldConfigValidateProp<FormValue> {
  validate?: FieldValidator<SingleValue<FormValue>>;
}

export type ChangeEventHandlerResolvedValue<ChangeHandlerValue> = [
  ChangeHandlerValue
] extends [React.ChangeEvent<infer Element>]
  ? Element extends { value: infer Value }
    ? Value
    : ChangeHandlerValue
  : ChangeHandlerValue;

/**
 * If ChangeHandlerValue cannot be assigned to FormValue,
 * parse is required.
 */
export type FieldConfigParseProp<FormValue, ChangeHandlerValue> = [
  ChangeHandlerValue
] extends [FormValue]
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
export type FieldConfigFormatProp<FormValue, FormattedValue> = [
  FormValue
] extends [FormattedValue]
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
  FieldConfigParseProp<
    FormValue,
    ChangeEventHandlerResolvedValue<ChangeHandlerValue>
  > &
  FieldConfigFormatProp<FormValue, FormattedValue>;

export interface FieldPassThroughFormattedValueProp<FormattedValue> {
  /** checkbox value to match against current value */
  value?: FormattedValue;
}

export type FieldConfigWithoutExtraProps<
  FormValue,
  FormattedValue,
  ChangeHandlerValue
> = FieldConfigValueProps<FormValue, FormattedValue, ChangeHandlerValue> &
  FieldPassThroughFormattedValueProp<FormattedValue> & {
    formatOnBlur?: boolean;
  };

export type FieldConfigExtraProps<FieldAs extends FieldAsCompatibleComponent> =
  Omit<
    React.ComponentProps<FieldAs>,
    | keyof FieldAsComponentRequiredProps<any, any>
    | keyof FieldConfigWithoutExtraProps<any, any, any>
  >;

/**
 * These props configure how the field works.
 */
export type FieldConfigProps<
  FormValue,
  FormattedValue,
  ChangeHandlerValue,
  ExtraProps
> = FieldConfigWithoutExtraProps<
  FormValue,
  FormattedValue,
  ChangeHandlerValue
> &
  ExtraProps;

export type FieldConfigPropsMatchingValue<
  Value,
  FieldAs extends FieldAsCompatibleComponent
> = Required<React.ComponentProps<FieldAs>> extends FieldAsComponentValueProps<
  infer FormattedValue,
  infer ChangeHandlerValue
>
  ? FieldConfigWithoutExtraProps<Value, FormattedValue, ChangeHandlerValue> &
      FieldConfigExtraProps<FieldAs>
  : never;

export type FieldConfigPropsByValue<
  Values extends FormikValues,
  Value,
  FieldAs extends FieldAsCompatibleComponent
> = FieldConfigNameProp<Values, PathMatchingValue<Value, Values>> &
  FieldConfigAsProp<FieldAs> &
  FieldConfigPropsMatchingValue<Value, FieldAs>;

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
  FieldConfigPropsMatchingName<Values, NoInfer<Name>, NoInfer<FieldAs>>;
