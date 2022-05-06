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
  validate?: FieldValidator<FormValue>;
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
export type FieldConfigParseProp<
  Values,
  FormValue,
  ChangeHandlerValue,
  ResolvedChangeHandlerValue
> = [ResolvedChangeHandlerValue] extends [FormValue]
  ? {
      parse?: ParseFn<Values, FormValue, ChangeHandlerValue>;
    }
  : {
      parse: ParseFn<Values, FormValue, ChangeHandlerValue>;
    };

/**
 * If FormValue cannot be assigned to FormattedValue,
 * format is required.
 */
export type FieldConfigFormatProp<FormValue, FormattedValue> = [
  FormValue
] extends [FormattedValue]
  ? {
      format?: FormatFn<FormValue, FormattedValue>;
    }
  : {
      format: FormatFn<FormValue, FormattedValue>;
    };

export type FieldConfigValueProps<
  Values,
  FormValue,
  FormattedValue,
  ChangeHandlerValue
> = FieldConfigValidateProp<FormValue> &
  FieldConfigParseProp<
    Values,
    FormValue,
    ChangeHandlerValue,
    ChangeEventHandlerResolvedValue<ChangeHandlerValue>
  > &
  FieldConfigFormatProp<FormValue, FormattedValue>;

export type FieldConfigWithoutExtraProps<
  Values,
  FormValue,
  FieldAs extends AnyFieldAsCompatibleComponent
> = [Required<React.ComponentProps<FieldAs>>] extends [
  FieldAsComponentValueProps<infer FormattedValue, infer ChangeHandlerValue>
]
  ? FieldConfigAsProp<FieldAs> &
      FieldConfigValueProps<
        Values,
        FormValue,
        FormattedValue,
        ChangeHandlerValue
      > & {
        formatOnBlur?: boolean;
      }
  : never;

/**
 * These props configure how the field works.
 */
export type FieldConfigProps<
  Values,
  FormValue,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldConfigWithoutExtraProps<Values, FormValue, FieldAs> &
  FieldAsComponentPassThroughPropsByComponent<FieldAs>;

export type FieldConfigPropsByValue<
  Values extends FormikValues,
  Value,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldConfigNameProp<Values, PathMatchingValue<Value, Values>> &
  FieldConfigProps<Values, Value, FieldAs>;

export type FieldConfigPropsByName<
  Values extends FormikValues,
  Name extends PathOf<Values>,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldConfigNameProp<Values, Name> &
  FieldConfigAsProp<FieldAs> &
  FieldConfigProps<Values, ValueMatchingPath<Values, Name>, FieldAs>;
