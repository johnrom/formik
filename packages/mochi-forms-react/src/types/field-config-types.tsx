import React from 'react';
import {
  PathMatchingValue,
  PathOf,
  ValueMatchingPath,
} from '../helpers/path-helpers';
import {
  FieldValidator,
  FormatFn,
  FormikValues,
  ParseFn,
  SingleValue,
} from '../types';
import {
  AnyFieldAsCompatibleComponent,
  FieldAsComponentPassThroughPropsByComponent,
  FieldAsComponentValueProps,
} from './field-as-component-types';

export interface FieldConfigNameProp<
  Values extends FormikValues,
  Name extends PathOf<Values>
> {
  name: Name;
}

export interface FieldConfigAsProp<
  FieldAs extends AnyFieldAsCompatibleComponent
> {
  as?: FieldAs;
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

export type FieldConfigWithoutExtraProps<
  FormValue,
  FieldAs extends AnyFieldAsCompatibleComponent
> = [Required<React.ComponentProps<FieldAs>>] extends [
  FieldAsComponentValueProps<infer FormattedValue, infer ChangeHandlerValue>
]
  ? FieldConfigAsProp<FieldAs> &
      FieldConfigValueProps<FormValue, FormattedValue, ChangeHandlerValue> & {
        formatOnBlur?: boolean;
      }
  : never;

/**
 * These props configure how the field works.
 */
export type FieldConfigProps<
  FormValue,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldConfigWithoutExtraProps<FormValue, FieldAs> &
  FieldAsComponentPassThroughPropsByComponent<FieldAs>;

export type FieldConfigPropsByValue<
  Values extends FormikValues,
  Value,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldConfigNameProp<Values, PathMatchingValue<Value, Values>> &
  FieldConfigProps<Value, FieldAs>;

export type FieldConfigPropsByName<
  Values extends FormikValues,
  Name extends PathOf<Values>,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldConfigNameProp<Values, Name> &
  FieldConfigAsProp<FieldAs> &
  FieldConfigProps<ValueMatchingPath<Values, Name>, FieldAs>;
