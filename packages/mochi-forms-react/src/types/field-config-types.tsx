import React from 'react';
import {
  PathMatchingValue,
  PathOf,
  ValueMatchingPath,
} from '../helpers/path-helpers';
import { FieldValidator, FormatFn, FormikValues, ParseFn } from '../types';
import {
  AnyFieldAsCompatibleComponent,
  FieldAsComponentPassThroughPropsByComponent,
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

export type FieldConfigParseProp<
  Values extends FormikValues,
  FormValue,
  ChangeHandlerValue
> = [ChangeEventHandlerResolvedValue<ChangeHandlerValue>] extends [FormValue]
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
  Values extends FormikValues,
  FormValue,
  FormattedValue,
  ChangeHandlerValue
> = FieldConfigValidateProp<FormValue> &
  FieldConfigParseProp<Values, FormValue, ChangeHandlerValue> &
  FieldConfigFormatProp<FormValue, FormattedValue>;

export type ChangeEventHandlerEvent<ChangeEventHandler> =
  ChangeEventHandler extends (event: infer ChangeEventHandlerValue) => void
    ? ChangeEventHandlerValue
    : never;

export type FieldConfigWithoutExtraProps<
  Values extends FormikValues,
  FormValue,
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldConfigAsProp<FieldAs> &
  FieldConfigValueProps<
    Values,
    FormValue,
    React.ComponentProps<FieldAs>['value'],
    ChangeEventHandlerEvent<React.ComponentProps<FieldAs>['onChange']>
  >;

/**
 * These props configure how the field works.
 */
export type FieldConfigProps<
  Values extends FormikValues,
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
