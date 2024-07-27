import * as React from 'react';
import { Field } from '../Field';
import { useFieldMeta } from '../FieldMeta';
import {
  noopFormatFn,
  parseCheckboxBooleanFromEvent,
} from '../helpers/parse-format-helpers';
import { FormikValues, ParseFn } from '../types';
import { FieldConfigPropsByValue } from '../types/field-config-types';

export type FormatCheckboxCheckedFn<Value> = (value: Value) => boolean;

export type CheckboxFieldParseProp<Values extends FormikValues, FormValue> = [
  boolean
] extends [FormValue]
  ? {
      parse?: ParseFn<Values, FormValue, React.ChangeEventHandler<'input'>>;
    }
  : {
      parse: ParseFn<Values, FormValue, React.ChangeEventHandler<'input'>>;
    };

export type CheckboxFormatCheckedProp<FormValue> = [boolean] extends [FormValue]
  ? {
      formatChecked?: FormatCheckboxCheckedFn<FormValue>;
    }
  : { formatChecked: FormatCheckboxCheckedFn<FormValue> };

export type CheckboxFieldProps<Values extends FormikValues, Value> = Omit<
  FieldConfigPropsByValue<Values, Value, 'input'>,
  'parse' | 'as' | 'format'
> &
  CheckboxFieldParseProp<Values, Value> &
  CheckboxFormatCheckedProp<Value>;

/**
 * Boolean checkbox is a special case where the input does not get passed a `value`.
 *
 * Instead, it gets passed a value for `checked`.
 *
 * Also, when parsing the value doesn't come from `event.target.value`, but `event.target.checked`.
 */
export const CheckboxField = <Values, Value>(
  props: CheckboxFieldProps<Values, Value>
) => {
  const { value: stateValue } = useFieldMeta<Values, Value>(props.name);
  const { name, parse, formatChecked, ...fieldProps } = props;

  return (
    <Field
      name={props.name}
      as="input"
      type={props.type ?? 'checkbox'}
      // this casts are required
      checked={formatChecked ? formatChecked(stateValue) : (stateValue as any)}
      parse={parse ?? (parseCheckboxBooleanFromEvent as any)}
      format={noopFormatFn}
      {...fieldProps}
    />
  );
};

export const getTypedCheckboxField = <Values,>() =>
  CheckboxField as <Value>(
    props: CheckboxFieldProps<Values, Value>
  ) => JSX.Element;
